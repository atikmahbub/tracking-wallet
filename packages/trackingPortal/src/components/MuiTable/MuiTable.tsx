import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// Define column structure interface
interface Column {
  label: string;
  key: string;
  align?: "left" | "right" | "center";
  render?: (row: any) => React.ReactNode; // Custom rendering logic if needed
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  collapsible?: boolean;
  actionIcons?: (row: any) => React.ReactNode[];
  onActionClick?: (row: any, action: string) => void;
  collapsibleContent?: (row: any, index: number) => React.ReactNode;
  showRowNumber?: boolean;
  collapsibleOpenIndex?: number | null; // Add this to control which row is open
  onCollapseToggle?: (index: number | null) => void; // Add this function to handle the collapse state
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  collapsible = true,
  actionIcons,
  onActionClick,
  collapsibleContent,
  showRowNumber = false,
  collapsibleOpenIndex = null, // Control the open/close state of collapse
  onCollapseToggle, // Handle the collapse toggle state
}) => {
  const handleCollapseToggle = (index: number) => {
    if (onCollapseToggle) {
      onCollapseToggle(collapsibleOpenIndex === index ? null : index); // Toggle collapse
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="dynamic table">
        <TableHead>
          <TableRow>
            {showRowNumber && <TableCell>#</TableCell>}
            {columns.map((column) => (
              <TableCell key={column.key} align={column.align || "left"}>
                {column.label}
              </TableCell>
            ))}
            <TableCell /> {/* Action Column */}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <React.Fragment key={row.id || index}>
              <TableRow>
                {showRowNumber && <TableCell>{index + 1}</TableCell>}
                {columns.map((column) => (
                  <TableCell key={column.key} align={column.align || "left"}>
                    {column.render ? column.render(row) : row[column.key]}
                  </TableCell>
                ))}
                <TableCell align="right">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    gap={1}
                  >
                    {collapsible && actionIcons && actionIcons(row)[0] && (
                      <IconButton
                        aria-label="toggle collapse"
                        size="small"
                        onClick={() => handleCollapseToggle(index)}
                      >
                        {actionIcons(row)[0]}
                      </IconButton>
                    )}
                    {actionIcons &&
                      actionIcons(row)
                        .slice(1)
                        .map((icon, i) => (
                          <IconButton
                            key={i}
                            aria-label={`action-${i}`}
                            size="small"
                            onClick={() =>
                              onActionClick && onActionClick(row, `action-${i}`)
                            }
                          >
                            {icon}
                          </IconButton>
                        ))}
                  </Box>
                </TableCell>
              </TableRow>
              {collapsible && collapsibleContent && (
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={columns.length + (showRowNumber ? 2 : 1)}
                  >
                    <Collapse
                      in={collapsibleOpenIndex === index}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box>{collapsibleContent(row, index)} </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
