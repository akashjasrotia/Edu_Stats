import React from 'react';

const CompareView = ({ dataSet1, dataSet2 }) => {
  return (
    <div className="compare-view">
      <h2 className="text-2xl font-bold mb-4">Data Comparison</h2>
      <div className="data-set">
        <h3 className="text-xl font-semibold">Data Set 1</h3>
        <pre>{JSON.stringify(dataSet1, null, 2)}</pre>
      </div>
      <div className="data-set">
        <h3 className="text-xl font-semibold">Data Set 2</h3>
        <pre>{JSON.stringify(dataSet2, null, 2)}</pre>
      </div>
    </div>
  );
};

export default CompareView;