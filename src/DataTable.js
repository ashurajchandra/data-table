import { useState, useMemo, useCallback } from "react";
import users from "./users";

const HEADERS = [
  { label: "ID", key: "id" },
  { label: "Name", key: "name" },
  { label: "Age", key: "age" },
  { label: "Occupation", key: "occupation" },
];
const DATA = users;

const BUCKET_SIZE = [5, 10, 15, 20];

const Bucket = ({ bucketSize, handleBucketChange }) => {
  return (
    <select
      value={bucketSize}
      onChange={(e) => handleBucketChange(Number(e.target.value))}
      className="bucket"
    >
      {BUCKET_SIZE.map((bucket, index) => (
        <option key={index} value={bucket}>{`Page Item ${bucket}`}</option>
      ))}
    </select>
  );
};

const Pagination = ({
  handlePageChange,
  totalItem,
  itemsPerPage,
  pageNumber,
}) => {
  const totalPages = Math.ceil(totalItem / itemsPerPage);

  const onPageChange = (actionType) => {
    handlePageChange(actionType === "next" ? pageNumber + 1 : pageNumber - 1);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        disabled={pageNumber === 1}
        className="nav-button prev-button"
        onClick={() => onPageChange("prev")}
      >
        &lt;
      </button>
      <div className="pages">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            className="pageNumber"
            key={index}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <button
        disabled={pageNumber === totalPages}
        className="nav-button next-button"
        onClick={() => onPageChange("next")}
      >
        &gt;
      </button>
    </div>
  );
};

export default function DataTable() {
  const [message, setMessage] = useState("Data Table");
  const [bucketSize, setBucketSize] = useState(BUCKET_SIZE[0]);
  const [pageNumber, setPageNumber] = useState(1);

  const startIndex = (pageNumber - 1) * bucketSize;
  const endIndex = pageNumber * bucketSize;

  const currentPageData = useMemo(
    () => DATA.slice(startIndex, endIndex),
    [startIndex, endIndex]
  );

  const handleBucketChange = useCallback((value) => {
    setBucketSize(value);
    setPageNumber(1);
  }, []);

  const handlePageChange = useCallback((value) => {
    setPageNumber(value);
  }, []);

  if (!HEADERS.length) {
    return <div>No data to display</div>;
  }

  return (
    <div>
      <h1>{message}</h1>
      <table>
        <thead>
          <tr>
            {HEADERS.map(({ label, key }) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((item) => {
            return (
              <tr key={item.id}>
                {HEADERS.map(({ key }) => (
                  <td key={key}>{item[key]}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="footer">
        <Bucket
          bucketSize={bucketSize}
          handleBucketChange={handleBucketChange}
        />
        <Pagination
          totalItem={DATA.length}
          itemsPerPage={bucketSize}
          pageNumber={pageNumber}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
