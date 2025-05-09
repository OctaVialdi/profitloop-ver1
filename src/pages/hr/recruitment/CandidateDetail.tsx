
import React from 'react';
import { useParams } from 'react-router-dom';

const CandidateDetail: React.FC = () => {
  const { candidateId } = useParams();
  
  return (
    <div>
      <h1 className="text-2xl font-bold">Candidate Detail</h1>
      <p>Viewing candidate with ID: {candidateId}</p>
    </div>
  );
};

export default CandidateDetail;
