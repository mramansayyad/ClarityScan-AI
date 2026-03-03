'use client';

import React from 'react';

type JsonViewerProps = {
  data: object;
};

const JsonViewer = ({ data }: JsonViewerProps) => {
  const jsonString = JSON.stringify(data, null, 2);

  return (
    <pre className="font-code bg-accent/50 p-4 rounded-md overflow-x-auto text-sm border border-border">
      <code>{jsonString}</code>
    </pre>
  );
};

export default JsonViewer;
