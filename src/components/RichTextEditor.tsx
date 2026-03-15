import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, Quote, Code, Undo, Redo, ImageIcon, Minus,
} from "lucide-react";
import { useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

function MenuBar({ editor }: { editor: any }) {
  if (!editor) return null;

  const btnClass = (active: boolean) =>
    `h-8 w-8 p-0 ${active ? "bg-muted text-foreground" : "text-muted-foreground"}`;

  return (
    <div className="flex flex-wrap gap-0.5 border-b border-border p-1.5 bg-muted/30">
      <Button type="button" variant="ghost" size="icon" className={btnClass(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={14} />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={btnClass(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={14} />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={btnClass(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon size={14} />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={btnClass(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough size={14} />
      </Button>

      <div className="w-px bg-border mx-1" />

      <Button type="button" variant="ghost" size="icon" className={btnClass(editor.isActive("heading", { level: 1 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1 size={14} />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={btnClass(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 size={14} />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={btnClass(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 size={14} />
      </Button>

      <div className="w-px bg-border mx-1" />

      <Button type="button" variant="ghost" size="icon" className={btnClass(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={14} />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={btnClass(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={14} />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={btnClass(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote size={14} />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={btnClass(editor.isActive("codeBlock"))} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code size={14} />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={btnClass(false)} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus size={14} />
      </Button>

      <div className="w-px bg-border mx-1" />

      <Button type="button" variant="ghost" size="icon" className={btnClass(editor.isActive({ textAlign: "left" }))} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <AlignLeft size={14} />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={btnClass(editor.isActive({ textAlign: "center" }))} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
        <AlignCenter size={14} />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={btnClass(editor.isActive({ textAlign: "right" }))} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
        <AlignRight size={14} />
      </Button>

      <div className="w-px bg-border mx-1" />

      <Button type="button" variant="ghost" size="icon" className={btnClass(false)} onClick={() => {
        const url = window.prompt("Image URL:");
        if (url) editor.chain().focus().setImage({ src: url }).run();
      }}>
        <ImageIcon size={14} />
      </Button>

      <div className="w-px bg-border mx-1" />

      <Button type="button" variant="ghost" size="icon" className={btnClass(false)} onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo size={14} />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={btnClass(false)} onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo size={14} />
      </Button>
    </div>
  );
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: true }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value]);

  return (
    <div className="rounded-md border border-input bg-background overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-3 min-h-[200px] focus-within:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[180px]"
      />
    </div>
  );
}