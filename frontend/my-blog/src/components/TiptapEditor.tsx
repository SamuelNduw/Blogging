import React, { useEffect, useRef } from "react";
import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image"

const extensions = [TextStyle, StarterKit, Image];

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  onUploadImage: (file: File) => Promise<string>;
}

function MenuBar({ 
  editor, 
  onImageButtonClick 
}: { 
  editor: Editor; 
  onImageButtonClick: () => void; 
}) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  // FIXED: Use onClick instead of onMouseDown to avoid interfering with text selection
  const handleButtonClick = (action: () => void) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    action();
  };

  const btnClass = (active: boolean, extra?: string) =>
    [
      "px-2 py-1 text-xs md:text-sm rounded border border-gray-300",
      "hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed",
      active ? "bg-gray-200 font-semibold" : "bg-white",
      extra ?? "",
    ].join(" ");

  return (
    <div className="mb-2 overflow-x-auto">
      <div className="inline-flex flex-wrap gap-1 bg-gray-50 border border-gray-300 rounded-md px-2 py-1">
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().toggleBold().run()
          )}
          disabled={!editorState.canBold}
          className={btnClass(editorState.isBold)}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().toggleItalic().run()
          )}
          disabled={!editorState.canItalic}
          className={btnClass(editorState.isItalic)}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().toggleStrike().run()
          )}
          disabled={!editorState.canStrike}
          className={btnClass(editorState.isStrike)}
        >
          Strike
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().toggleCode().run()
          )}
          disabled={!editorState.canCode}
          className={btnClass(editorState.isCode)}
        >
          Code
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().unsetAllMarks().run()
          )}
          disabled={!editorState.canClearMarks}
          className={btnClass(false)}
        >
          Clear marks
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().clearNodes().run()
          )}
          className={btnClass(false)}
        >
          Clear nodes
        </button>

        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().setParagraph().run()
          )}
          className={btnClass(editorState.isParagraph)}
        >
          Paragraph
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          )}
          className={btnClass(editorState.isHeading1)}
        >
          H1
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          )}
          className={btnClass(editorState.isHeading2)}
        >
          H2
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          )}
          className={btnClass(editorState.isHeading3)}
        >
          H3
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          )}
          className={btnClass(editorState.isHeading4)}
        >
          H4
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          )}
          className={btnClass(editorState.isHeading5)}
        >
          H5
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          )}
          className={btnClass(editorState.isHeading6)}
        >
          H6
        </button>

        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().toggleBulletList().run()
          )}
          className={btnClass(editorState.isBulletList)}
        >
          Bullet list
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().toggleOrderedList().run()
          )}
          className={btnClass(editorState.isOrderedList)}
        >
          Ordered list
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().toggleCodeBlock().run()
          )}
          className={btnClass(editorState.isCodeBlock)}
        >
          Code block
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().toggleBlockquote().run()
          )}
          className={btnClass(editorState.isBlockquote)}
        >
          Blockquote
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().setHorizontalRule().run()
          )}
          className={btnClass(false)}
        >
          Horizontal rule
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().setHardBreak().run()
          )}
          className={btnClass(false)}
        >
          Hard break
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onImageButtonClick();
          }}
          className={btnClass(false, "ml-2")}
        >
          Image
        </button>

        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().undo().run()
          )}
          disabled={!editorState.canUndo}
          className={btnClass(false)}
        >
          Undo
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() =>
            editor.chain().focus().redo().run()
          )}
          disabled={!editorState.canRedo}
          className={btnClass(false)}
        >
          Redo
        </button>
      </div>
    </div>
  );
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  value,
  onChange,
  onUploadImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions,
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose max-w-none min-h-[260px] px-3 py-2 focus:outline-none cursor-text select-text",
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = value || "";
    if (incoming !== current) {
      editor.commands.setContent(incoming, false);
    }
  }, [value, editor]);

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!editor) return;
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await onUploadImage(file);
      editor
        .chain()
        .focus()
        .setImage({ src: url, alt: file.name })
        .run();
    } catch (err) {
      console.error("Inline image upload failed", err);
    } finally {
      e.target.value = ""; 
    }
  };

  if (!editor) return null;

  return (
    <div className="w-full space-y-2">
      <MenuBar editor={editor} onImageButtonClick={handleImageButtonClick}/>

      {/* hidden file input for images */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="w-full border border-gray-300 rounded-lg shadow-sm focus-within:ring focus-within:ring-indigo-500">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};