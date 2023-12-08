import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";

function Paginate({ className, address, pages, page }) {
  return (
    pages > 1 && (
      <Pagination className={className}>
        {[...Array(pages).keys()].map((x) => {
          const url = new URL(`${address}/?page=${x + 1}`, "http://127.0.0.1:3000");
          const path = {
            hash: url.hash,
            pathname: url.pathname,
            search: url.search,
          };
          const itemStyle = {
            //backgroundColor: x + 1 === page ? "red" : "",
            //border: x + 1 === page ? '2px solid #333' : "",
            padding: x + 1 === page ? '2px' : "",
            textDecoration: x + 1 === page ? "underline" : "",
          }

          return (
            <LinkContainer key={x + 1} to={path}>
              <Pagination.Item active={x + 1 === page}><div style={itemStyle}>{x + 1}</div></Pagination.Item>
            </LinkContainer>
          );
        })}
      </Pagination>
    )
  );
}

export default Paginate;
