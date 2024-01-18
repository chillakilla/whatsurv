import React from 'react';
import {Viewer} from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

interface ContentsViewerProps {
  contents: string;
}

export default function ContentsViewer({contents}: ContentsViewerProps) {
  return <Viewer initialValue={contents || ''} />;
}
