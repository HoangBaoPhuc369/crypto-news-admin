/* eslint-disable react/no-danger */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-duplicates */
/* eslint-disable prefer-const */
/* eslint-disable spaced-comment */
import React, { useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import { useQuill } from 'react-quilljs';
import BlotFormatter from 'quill-blot-formatter';
import { useEffect } from 'react';
import './style.css';
import parse from 'html-react-parser';

Quill.register('modules/imageResize', ImageResize);

const Editor = () => {
  const { quill, quillRef, Quill } = useQuill({
    modules: { blotFormatter: {} },
  });

  if (Quill && !quill) {
    // const BlotFormatter = require('quill-blot-formatter');
    Quill.register('modules/blotFormatter', BlotFormatter);
  }

  const [content, setContent] = useState('');

  useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldContents) => {
        setContent(quill.root.innerHTML);
      });
    }
  }, [quill, Quill]);

  return (
    <>
      <div>
        <div ref={quillRef} />
      </div>

      {/* How to display in detail post */}
      {/* <div className="ql-editor">{parse(content)}</div> */}
    </>
  );
};

export default Editor;
