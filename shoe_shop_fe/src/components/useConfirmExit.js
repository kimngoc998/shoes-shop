import { useEffect } from 'react';

const useConfirmExit = () => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    const confirmExit = () => {
      return 'Bạn có chắc muốn rời khỏi trang? Những thay đổi chưa được lưu sẽ bị mất.';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.onbeforeunload = confirmExit;

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.onbeforeunload = null;
    };
  }, []);
};

export default useConfirmExit;