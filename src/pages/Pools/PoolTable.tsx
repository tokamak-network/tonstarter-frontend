import {FC, useState, useRef} from 'react';
import {
  Column,
  useExpanded,
  usePagination,
  useTable,
  useSortBy,
} from 'react-table';
import {
  chakra,
  Text,
  Flex,
  IconButton,
  Tooltip,
  Select,
  Box,
  Avatar,
  useColorMode,
  Center,
  useTheme,
  Image,
} from '@chakra-ui/react';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {TriangleUpIcon, TriangleDownIcon} from '@chakra-ui/icons';
import {useAppSelector} from 'hooks/useRedux';
import {useEffect} from 'react';
import {setTimeout} from 'timers';
import {LoadingComponent} from 'components/Loading';

type PoolTableProps = {
  columns: Column[];
  data: any[];
  renderDetail: Function;
  isLoading: boolean;
}

const getTextColor = (type: string, colorMode: string) => {
  if (colorMode === 'light') {
    if (type === 'name') {
      return '#304156';
    }
    return '#3a495f';
  } else if (colorMode === 'dark') {
    if (type === 'name') {
      return 'white.100';
    }
    return '#f3f4f1';
  }
};

export const PoolTable: FC<PoolTableProps> = ({
  columns,
  data,
  renderDetail,
  isLoading,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    page,
    nextPage,
    previousPage,
    setPageSize,
    state: {pageIndex, pageSize},
  } = useTable(
    {columns, data, initialState: {pageIndex: 0}},
    useSortBy,
    useExpanded,
    usePagination,
  );

  const {colorMode} = useColorMode();
  const theme = useTheme();
  const focusTarget = useRef<any>([]);

  return (<Flex w="1100px" flexDir={'column'}></Flex>)
}