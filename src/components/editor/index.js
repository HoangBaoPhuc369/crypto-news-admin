/* eslint-disable import/order */
/* eslint-disable react-hooks/exhaustive-deps */
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
import ImageApiService from '../../services/api-services/images.service';
import toastService from '../../services/core/toast.service';
import { useMutation } from 'react-query';
import _ from 'lodash';
import { useSelector } from 'react-redux';

Quill.register('modules/imageResize', ImageResize);

const Editor = ({ hanldeEditor }) => {
  const { user } = useSelector((state) => state.auth);
  const { quill, quillRef, Quill } = useQuill({
    modules: { blotFormatter: {} },
  });

  // Insert Image(selected by user) to quill
  const insertToEditor = (url) => {
    const range = quill.getSelection();
    quill.insertEmbed(range.index, 'image', url);
  };

  if (Quill && !quill) {
    // const BlotFormatter = require('quill-blot-formatter');
    Quill.register('modules/blotFormatter', BlotFormatter);
  }

  const mUploadImage = useMutation((data) => ImageApiService.uploadImage(data), {
    onError: (err) => {
      toastService.toast('error', 'Error', 'Upload Image Failed!');
    },
  });

  // Upload Image to Image Server such as AWS S3, Cloudinary, Cloud Storage, etc..
  const saveToServer = async (file) => {
    const body = new FormData();
    body.append('uploaded_file', file);
    const uploadedImage = await mUploadImage.mutateAsync({
      formData: body,
      token: _.get(user, 'token', ''),
      path: 'editor',
    });
    insertToEditor(
      _.get(
        uploadedImage,
        'data.url',
        'https://res.cloudinary.com/crypto-new-cloud/image/upload/v1697279024/post/0f8b3c4e0b70d524c8841134b6796c27.png.png'
      )
    );
  };

  // Open Dialog to select Image File
  const selectLocalImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      let files = Array.from(input.files);

      files.forEach((img) => {
        if (
          img.type !== 'image/jpeg' &&
          img.type !== 'image/png' &&
          img.type !== 'image/webp' &&
          img.type !== 'image/gif'
        ) {
          toastService.toast(
            'error',
            'Warning',
            `${img.name} format is unsupported ! only Jpeg, Png, Webp, Gif are allowed.`
          );
          files = files.filter((item) => item.name !== img.name);
        } else if (img.size > 1024 * 1024) {
          toastService.toast('error', 'Warning', `${img.name} size is too large max 5mb allowed.`);
          files = files.filter((item) => item.name !== img.name);
        } else {
          saveToServer(file);
        }
      });
    };
  };

  // const [content, setContent] = useState('');

  useEffect(() => {
    if (quill) {
      quill.getModule('toolbar').addHandler('image', selectLocalImage);

      quill.on('text-change', (delta, oldContents) => {
        hanldeEditor(quill.root.innerHTML);
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
