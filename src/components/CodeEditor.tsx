import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { Box, Button } from "@chakra-ui/react";

// TODO: HANDLE XSS
export const CodeEditor = () => {
  const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}`);
  const [executionResult, setExecutionResult] = useState(null);

  const handleRun = async () => {
    const result = await fetch("/api/evaluate", { method: 'POST', body: code});
    console.log(result);
    const json = await result.json();
    setExecutionResult(json)
  };

  return (
    <>
      <Box>
        <Editor
          value={code}
          onValueChange={(code) => setCode(code)}
          textareaId="codeArea"
          className="editor"
          highlight={(code) =>
            highlight(code, languages.js, "javascript")
              .split("\n")
              .map(
                (line, i) =>
                  `<span class='editorLineNumber'>${i + 1}</span>${line}`
              )
              .join("\n")
          }
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 16,
            border: 0,
          }}
        />
      </Box>
      <Button onClick={handleRun} mr={1}>Run</Button>
      <Button>Publish</Button>

      <Box>
        {executionResult && JSON.stringify(executionResult, null, 2)}
      </Box>
    </>
  );
};
