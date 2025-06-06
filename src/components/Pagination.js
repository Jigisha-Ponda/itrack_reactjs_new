import React from 'react';
import { Pagination } from 'react-bootstrap';

const MyPagination = ({ totalPages, currentPage, onPageChange }) => {
  const handleClick = (page) => {
    onPageChange(page);
  };

  return (
    <Pagination >
      <Pagination.Prev
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {[...Array(totalPages).keys()].map((page) => (
        <Pagination.Item
          key={page + 1}
          active={page + 1 === currentPage}
          onClick={() => handleClick(page + 1)}
        >
          {page + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
};

export default MyPagination;
