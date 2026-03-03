import React from 'react';

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return <h1 className="text-2xl font-headline font-semibold">{title}</h1>;
};

export default PageHeader;
