"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Heading, { Level } from "@tiptap/extension-heading";
import { Bold, Italic, List, ListOrdered, Type } from "lucide-react";
import { useEffect } from "react";

type tiptapeditorpros={
  value: string;
  onChange: (content: string) => void;
}
const TiptapEditor = ({
  value,
  onChange,
}: tiptapeditorpros) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
      }),
      TextStyle,
      FontFamily.configure({ types: ["textStyle"] }),
      BulletList.configure({
        HTMLAttributes: { class: "list-disc list-outside pl-4" },
      }),
      OrderedList.configure({
        HTMLAttributes: { class: "list-decimal list-outside pl-4" },
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc", 
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white p-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {/* Font Family */}
        <select
          value={editor.getAttributes("textStyle").fontFamily || ""}
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          className="p-2 border rounded"
        >
          <option value="">Default</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
        </select>

        {/* Headings */}
        <select
  onChange={(e) => editor.chain().focus().toggleHeading({ level: parseInt(e.target.value) as Level}).run()}
  className="p-2 border rounded"
>
  <option value="4">Normal</option>
  <option value="1">H1</option>
  <option value="2">H2</option>
  <option value="3">H3</option>
</select>


        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 border rounded ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
        >
          <Bold size={18} />
        </button>

        {/* Italics */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 border rounded ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
        >
          <Italic size={18} />
        </button>

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 border rounded ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
        >
          <List size={18} />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 border rounded ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
        >
          <ListOrdered size={18} />
        </button>
      </div>

      {/* Editor */}
      <div className="min-h-10 bg-white p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
