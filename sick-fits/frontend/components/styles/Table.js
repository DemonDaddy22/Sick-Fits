import styled from 'styled-components';

const Table = styled.table`
  border-spacing: 0;
  width: 100%;
  border: 1px solid ${props => props.theme.offwhite};
  thead {
    font-size: 10px;
  }
  td,
  th {
    border-bottom: 1px solid ${props => props.theme.offwhite};
    border-right: 1px solid ${props => props.theme.offwhite};
    padding: 10px 5px;
    position: relative;
    &:last-child {
      border-right: none;
      width: 150px;
      button {
        width: 100%;
      }
    }
  }
  tr {
    transition: background-color 0.15s ease;
    &:hover {
      background: ${props => props.theme.offwhite};
    }
  }
`;

export default Table;
