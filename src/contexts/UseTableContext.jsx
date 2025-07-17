import { useContext } from 'react';
import { TableContext } from './TableContext';

export default function useTableContext() {

    return useContext(TableContext);
}