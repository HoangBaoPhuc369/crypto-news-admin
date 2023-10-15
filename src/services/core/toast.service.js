/* eslint-disable arrow-body-style */
import _ from 'lodash';
import { toast as toastf, Zoom } from 'react-toastify';
import Swal from 'sweetalert2';

const toast = (icon, title, text, position, timer) => {
  let background = '#ffffff';
  let color = '#545454';
  switch (icon) {
    case 'success':
      background = '#5cb85c';
      color = 'white';
      break;

    case 'error':
      background = '#d9534f';
      color = 'white';
      break;
    default:
      break;
  }
  return Swal.fire({
    icon,
    title,
    toast: true,
    html: text,
    position: position || 'top',
    background,
    color,
    showConfirmButton: false,
    timer: timer || 3000,
    timerProgressBar: true,

    didOpen: (toastr) => {
      toastr.addEventListener('mouseenter', Swal.stopTimer);
      toastr.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
};

const showSuccess = (args) => {
  return Swal.fire({
    ...args,
    icon: 'success',
  });
};

const showError = (args) => {
  return Swal.fire({
    ...args,
    icon: 'error',
  });
};

const showInfo = (args) => {
  return Swal.fire({
    confirmButtonText: 'Đồng ý',
    allowOutsideClick: false,
    ...args,
    icon: 'info',
  });
};

const showWarning = (args) => {
  return Swal.fire({
    confirmButtonText: 'Đồng ý',
    ...args,
    icon: 'warning',
  });
};

const showConfirm = async (args) => {
  return Swal.fire({
    backdrop: true,
    title: args.title || '',
    text: args.text,
    icon: args.icon || 'question',
    showCancelButton: true,
    confirmButtonText: args.confirmButtonText ?? 'Đồng ý',
    cancelButtonText: args.cancelButtonText ?? 'Hủy bỏ',
    denyButtonText: args.denyButtonText ?? 'Hủy bỏ',
    allowOutsideClick: args.allowOutsideClick ?? false,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      return args.onConfirm?.();
    }
    if (result.isDenied) {
      return args.onDenied?.();
    }
    return args.onDenied?.();
  });
};

const showDeleteConfirm = (args) => {
  return Swal.fire({
    title: args.title || '',
    text: args.text || "You won't be able to revert this!",
    icon: args.icon || 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: args.confirmButtonText ?? 'Đồng ý',
    cancelButtonText: args.cancelButtonText ?? 'Hủy bỏ',
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      return args.onConfirm?.();
    }
    if (result.isDenied) {
      return args.onDenied?.();
    }
    return args.onDenied?.();
  });
};

const showLoading = () => {
  return Swal.fire({
    title: 'Loading',
    timerProgressBar: true,
  });
};

const toastError = (err) => {
  toast(
    'error',
    _.get(err, 'error.message', 'Có lỗi xảy ra'),
    _.get(err, 'error.details', 'Vui lòng liên hệ bộ phận liên quan để được hỗ trợ')
  );
};
const toastify = (typeToast, content) => {
  toastf(content, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    type: typeToast ?? 'default',
    theme: 'colored',
    transition: Zoom,
  });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  toastError,
  toast,
  toastify,
  showConfirm,
  showDeleteConfirm,
  showError,
  showSuccess,
  showLoading,
  showInfo,
  showWarning,
};
