// 'use client';
// import React, {useEffect} from 'react';
// import {useParams} from 'next/navigation';
// import {getAnswerStatistics} from '../_components/ChartData';

// type SurveyResultProps = {
//   surveyData: {label: string; count: number}[];
// };

// export default function ItResultpage({surveyData}: SurveyResultProps) {
//   // 설문조사 결과 분류
//   // 연령, 성별, 문항에 대한 대답 통계 -> 전체일 경우 어떤 연령대와 성별에서 가장 많은 표를 받은걸 보여주기
//   const {id} = useParams();
//   useEffect(() => {
//     const postId = Array.isArray(id) ? id[0] : id;

//     getAnswerStatistics(postId).then(questionStatistics => {
//       if (questionStatistics !== null) {
//         // Iterate over the entries and render charts
//         Object.entries(questionStatistics).forEach(([questionKey, questionData]) => {
//           renderChart(
//             Object.entries(questionData).map(([answer, count]) => ({label: answer, count})),
//             'bar',
//             `questionChartContainer-${questionKey}`,
//           );
//         });
//       }
//     });
//   }, [id]);
//   return (
//     <div>
//       {surveyData?.map((data, index) => (
//         <canvas key={index} id={`questionChartContainer-${index}`} width="400" height="400"></canvas>
//       ))}
//     </div>
//   );
// }
// function renderChart(arg0: {label: string; count: number}[], arg1: string, arg2: string) {
//   throw new Error('Function not implemented.');
// }
