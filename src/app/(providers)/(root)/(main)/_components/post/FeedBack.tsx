import React, {FormEvent, useState} from 'react';
import {sendData} from '@/app/api/sendFeedBack';
import Swal from 'sweetalert2';
import {title} from 'process';

export default function FeedBack() {
  const [feedback, setFeedback] = useState('');

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (feedback.trim() === '') {
      return;
    }

    try {
      await sendData(feedback);

      Swal.fire({
        title: '제출하시겠습니까?',
        text: '고객님의 소중한 피드백 감사합니다.',
        icon: 'warning',

        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: '닫기',
        confirmButtonColor: '#0051FF',
        confirmButtonText: '확인',
      }).then(result => {
        if (result.isConfirmed) {
          Swal.fire('감사합니다.');
          setFeedback('');
        }
      });

      // Additional logic after SweetAlert, if needed
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  return (
    <div>
      <form className="bg-slate-300 h-52 p-4 flex flex-col justify-between mb-4" onSubmit={submitHandler}>
        <h3 className="text-xl font-semibold">이용 중에 불편하신 사항이 있으신가요?</h3>
        <p>
          더 나은 whatSurv을 위해 고객님의 피드백을 보내주세요!
          <br />
          문의 메일: whatsurvvvv@gmail.com
        </p>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="소중한 의견 감사합니다!"
            className="w-[500px] h-[40px] p-4"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
          />
          <button type="submit" className="bg-[#0051FF] text-white w-[80px] h-[40px]">
            보내기
          </button>
        </div>
      </form>
    </div>
  );
}
