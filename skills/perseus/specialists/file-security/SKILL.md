---
name: perseus-file-security
description: Deep-dive file and upload security analysis (path traversal, upload bypass, XXE)
---

# Perseus File Security Specialist

## Context & Authorization

**IMPORTANT:** This skill performs file handling security analysis on the **user's own codebase**. This is defensive security testing to find file-related vulnerabilities.

**Authorization:** The user owns this codebase and has explicitly requested this specialized analysis.

---

## Overview

This specialist skill performs comprehensive file operation and upload security analysis.

**When to Use:** After `/scan` identifies file upload endpoints, file serving, or file system operations.

**Goal:** Ensure all file operations are secure against traversal, upload attacks, and XML-based exploits.

## File Security Risks Covered

| Risk | Description | Impact |
|------|-------------|--------|
| Path Traversal | `../` to access arbitrary files | Data theft, config exposure |
| Unrestricted Upload | No file type validation | RCE via webshell |
| File Type Bypass | Extension/MIME validation bypass | Malware upload |
| XXE | XML External Entity injection | SSRF, file read, DoS |
| Zip Slip | Path traversal in archives | Arbitrary file write |
| Symlink Attacks | Following malicious symlinks | Privilege escalation |

## Execution Instructions

### Phase 1: Path Traversal Analysis (3 Parallel Agents)

1.  **File Read Traversal Analyst:**
    *   "Find all file read operations with user input. Check for: path normalization, directory restrictions, symlink handling. Flag patterns like `readFile(basePath + userInput)`."

    **Vulnerable Patterns:**
    ```javascript
    // Vulnerable
    fs.readFile('./uploads/' + req.params.filename)

    // Safe
    const safePath = path.join('./uploads/', path.basename(filename));
    if (!safePath.startsWith(path.resolve('./uploads/'))) throw new Error('Invalid path');
    ```

2.  **File Write Traversal Analyst:**
    *   "Find all file write operations with user input. Check for: directory creation, filename sanitization. File write traversal can lead to code execution via config/code overwrite."

3.  **Include/Require Traversal Analyst:**
    *   "Find dynamic file includes (PHP include, require, import). Check for: user-controlled paths, extension restrictions. This leads directly to RCE."

    **Language-Specific:**
    - PHP: `include`, `require`, `include_once`, `require_once`
    - Python: `__import__`, `importlib.import_module`
    - Node.js: Dynamic `require()`, `import()`

### Phase 2: File Upload Analysis (4 Parallel Agents)

1.  **Upload Endpoint Analyst:**
    *   "Find all file upload handlers. Document: accepted file types, size limits, storage location, filename handling, content type validation."

2.  **File Type Validation Analyst:**
    *   "Check how file types are validated. Flag: extension-only checks, client-side MIME type trust. Verify: magic byte validation, content inspection."

    **Bypass Techniques to Check Against:**
    - Double extension: `shell.php.jpg`
    - Null byte: `shell.php%00.jpg`
    - Case variation: `shell.PHP`
    - Alternative extensions: `.php5`, `.phtml`, `.phar`
    - MIME mismatch: `image/jpeg` header with PHP content

3.  **Storage Security Analyst:**
    *   "Check where uploaded files are stored. Flag: web-accessible directories, predictable paths, original filename retention. Verify: random filenames, non-executable storage."

4.  **Image Processing Analyst:**
    *   "Find image processing libraries (ImageMagick, PIL, Sharp). Check for: ImageTragick vulnerabilities, SVG with embedded scripts, polyglot files."

### Phase 3: XML Security Analysis (3 Parallel Agents)

1.  **XXE Analyst:**
    *   "Find all XML parsing. Check parser configuration for: external entity processing, DTD loading, XInclude. Flag any default XML parser without explicit security config."

    **Language-Specific Safe Configs:**
    ```python
    # Python - Safe
    from defusedxml import ElementTree

    # Java - Safe
    factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);

    # PHP - Safe
    libxml_disable_entity_loader(true);
    ```

2.  **XSLT Injection Analyst:**
    *   "Find XSLT transformation with user input. Check for: user-controlled stylesheets, extension functions enabled. XSLT can execute code in many implementations."

3.  **SVG Analyst:**
    *   "Check SVG upload/processing. SVGs can contain: JavaScript, XXE payloads, CSS-based attacks. Verify: SVG sanitization, Content-Type headers."

### Phase 4: Archive Security (2 Parallel Agents)

1.  **Zip Slip Analyst:**
    *   "Find archive extraction (zip, tar, etc.). Check for: path validation before extraction, symlink handling. Flag libraries with known Zip Slip vulnerabilities."

    **Vulnerable Pattern:**
    ```java
    // Vulnerable - no path validation
    ZipEntry entry = zip.getNextEntry();
    File destFile = new File(destDir, entry.getName());
    ```

2.  **Archive DoS Analyst:**
    *   "Check for zip bomb protection. Verify: extraction size limits, entry count limits, compression ratio checks."

## Safe Payload Reference

| Attack | Safe Test Payload | Verification |
|--------|-------------------|--------------|
| Path Traversal | `../../../etc/passwd` | File contents returned |
| XXE | DTD with file:// entity | Local file in response |
| Upload Bypass | `test.php.jpg` with PHP content | Check if executed |
| Zip Slip | Zip with `../../` paths | Check extraction location |

## Output Requirements

Create `deliverables/file_security_analysis.md`:

```markdown
# File Security Analysis

## Summary
| Category | Endpoints | Vulnerable | Safe |
|----------|-----------|------------|------|
| File Read | X | Y | Z |
| File Write | X | Y | Z |
| File Upload | X | Y | Z |
| XML Parsing | X | Y | Z |
| Archive Handling | X | Y | Z |

## Critical Findings

### [FILE-001] Path Traversal in Document Download
**Severity:** Critical
**Location:** `routes/documents.js:45`
**Endpoint:** `GET /api/documents/:filename`

**Vulnerable Code:**
```javascript
app.get('/api/documents/:filename', (req, res) => {
  const filePath = path.join('./documents/', req.params.filename);
  res.sendFile(filePath);
});
```

**Attack:**
```
GET /api/documents/..%2F..%2F..%2Fetc%2Fpasswd
```

**Impact:** Arbitrary file read - can access `/etc/passwd`, config files, source code

**Remediation:**
```javascript
app.get('/api/documents/:filename', (req, res) => {
  const filename = path.basename(req.params.filename); // Remove path components
  const filePath = path.resolve('./documents/', filename);

  // Verify still within documents directory
  if (!filePath.startsWith(path.resolve('./documents/'))) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  res.sendFile(filePath);
});
```

---

### [FILE-002] Unrestricted File Upload
**Severity:** Critical
**Location:** `controllers/upload.js:23`
...

## Upload Endpoints

| Endpoint | Types Allowed | Validation | Storage | Risk |
|----------|---------------|------------|---------|------|
| POST /upload | any | None | /public/uploads | CRITICAL |
| POST /avatar | image/* | Extension only | /public/avatars | HIGH |
| POST /documents | .pdf,.doc | Magic bytes | /private/docs | LOW |

## XML Parser Configuration

| Location | Parser | XXE Protection | Status |
|----------|--------|----------------|--------|
| api/import.js | xml2js | Default (unsafe) | VULNERABLE |
| utils/config.js | DOMParser | Entities disabled | SAFE |

## Recommendations
1. Implement path.basename() and directory containment checks
2. Add magic byte validation for all uploads
3. Store uploads outside web root with random names
4. Disable external entities in all XML parsers
```

**Next Step:** Findings feed into `/exploit` for verification.
