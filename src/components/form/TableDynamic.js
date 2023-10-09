/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable arrow-body-style */
import {
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableCellProps,
    TableContainer,
    TableContainerProps,
    TableHead,
    TablePagination,
    TableProps,
    TableRow,
    TableRowProps,
    Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
// import img_empty_data from 'assets/images/img_empty_data.svg';
import * as React from 'react';
import HDTableSkeleton from 'ui-component/cards/Skeleton/HDTableSkeleton';

const useStyles = makeStyles({
    tableBorder: {
        minWidth: 650,
        '& .MuiTableCell-root': {
            borderLeft: '1px solid rgba(224, 224, 224, 1)',
            borderRight: '1px solid rgba(224, 224, 224, 1)'
        }
    },
    sticky: {
        position: 'sticky',
        left: 0,
        borderRight: '1px solid rgba(224, 224, 224, 1)',
        background: 'white',
        zIndex: 100000
    }
});

export default function TableDynamic({
    onChangePage,
    onChangeRowsPerPage,
    rows,
    columns,
    rowsPerPage = 10,
    sxTableContainer,
    sxTable,
    sxTableRow,
    hideHeader = false,
    totalRow = 0,
    onClickRow,
    loading = false,
    skipCount,
    border,
    size = 'small',
    rowsPerPageOptions = [
        { label: '10', value: 10 },
        { label: '25', value: 25 },
        { label: '100', value: 100 },
        { label: 'Tất cả', value: 3000 }
    ]
}) {
    const handleChangePage = (event, newPage) => {
        onChangePage(event, newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        onChangeRowsPerPage(event);
    };

    const classes = useStyles();

    return (
        <>
            <TableContainer sx={{ ...sxTableContainer }}>
                <Table
                    stickyHeader
                    aria-label="sticky table"
                    size={size}
                    sx={{
                        ...sxTable,
                        borderTop: border ? '1px solid rgba(224, 224, 224, 1)' : 'none',
                        borderBottom: border ? '1px solid rgba(224, 224, 224, 1)' : 'none'
                    }}
                    className={border ? classes.tableBorder : ''}
                >
                    {!Boolean(hideHeader) && (
                        <TableHead>
                            <TableRow hover tabIndex={-1}>
                                {columns.map((column) => {
                                    return (
                                        <TableCell
                                            className={column.sticky ? classes.sticky : ''}
                                            key={column.id}
                                            align={column.align}
                                            sx={column.headerCellSX}
                                        >
                                            {column.customHeader ? column.customHeader?.() : column.label}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                    )}

                    <TableBody>
                        {Boolean(loading) ? (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <HDTableSkeleton />
                                </TableCell>
                            </TableRow>
                        ) : (
                            <>
                                {Boolean(totalRow > 0) &&
                                    rows.map((row, index) => (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={index}
                                            onClick={() => onClickRow?.(row)}
                                            sx={{ cursor: onClickRow ? 'pointer' : 'default', ...sxTableRow }}
                                        >
                                            {columns.map((column, indexColumn) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell
                                                        className={column.sticky ? classes.sticky : ''}
                                                        key={indexColumn}
                                                        align={column.align}
                                                        sx={{ width: column.width || 'max-content' }}
                                                    >
                                                        {Boolean(column.renderCell)
                                                            ? column.renderCell?.(row)
                                                            : Boolean(column.format)
                                                            ? column.format?.(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                {Boolean(totalRow === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} align="center">
                                            {/* <img src={img_empty_data} alt="No Data !" /> */}
                                            No data
                                            <Typography variant="subtitle1" fontStyle="italic" sx={{ mt: 1, mb: 3 }}>
                                                Không tìm thấy dữ liệu !
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {Boolean(totalRow > 0) && (
                <TablePagination
                    rowsPerPageOptions={rowsPerPageOptions}
                    component="div"
                    count={totalRow}
                    rowsPerPage={rowsPerPage}
                    page={skipCount / rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Tổng số trên 1 trang:"
                    nextIconButtonProps={{
                        sx: { display: 'none' }
                    }}
                    backIconButtonProps={{
                        sx: { display: 'none' }
                    }}
                    labelDisplayedRows={(paginationInfo) => (
                        <Typography component={'span'} variant={'body2'}>
                            <Typography variant="subtitle2" sx={{ ml: 1.5 }} component="span">
                                Hiển thị từ {paginationInfo.from} - {paginationInfo.to} trên tổng số {paginationInfo.count}
                            </Typography>
                            <Pagination
                                count={Math.floor((paginationInfo.count + rowsPerPage - 1) / rowsPerPage)}
                                color="primary"
                                page={paginationInfo.page + 1}
                                onChange={(e, v) => handleChangePage(e, v - 1)}
                                showFirstButton
                                showLastButton
                            />
                        </Typography>
                    )}
                />
            )}
        </>
    );
}
