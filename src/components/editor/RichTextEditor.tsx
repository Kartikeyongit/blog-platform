"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something amazing...",
}: RichTextEditorProps) {
  return (
    <div className="editor-container" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        preview="live"
        height={400}
        visibleDragbar={false}
        textareaProps={{
          placeholder: placeholder,
        }}
        previewOptions={{
          className: "prose max-w-none"
        }}
      />
    </div>
  );
}