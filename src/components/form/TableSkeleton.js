// material-ui
import { Skeleton } from '@mui/material';
import _ from 'lodash';

// ==============================|| SKELETON - TOTAL INCOME DARK/LIGHT CARD ||============================== //

const TableSkeleton = () => (
  <>
    {_.map([...Array(5)], (_, index) => (
      <Skeleton key={index} variant="rectangular" sx={{ my: 3, mx: 3 }} />
    ))}
  </>
);

export default TableSkeleton;
