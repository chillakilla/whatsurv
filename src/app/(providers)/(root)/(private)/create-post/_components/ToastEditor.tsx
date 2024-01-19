import React, {useRef} from 'react';
import {Editor} from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';

export default function ToastEditor() {
  const editorRef = useRef<Editor>(null);

  const onChange = () => {
    const data = editorRef.current?.getInstance().getHTML();
    console.log(data);
  };

  return (
    <div className="edit_wrap w-[64.625rem]">
      <Editor
        initialValue="내용을 입력해주세요."
        previewStyle="vertical"
        height="18.75rem"
        initialEditType="markdown"
        useCommandShortcut={false}
        language="ko-KR"
        ref={editorRef}
        onChange={onChange}
        plugins={[colorSyntax]}
      />
    </div>
  );
}
