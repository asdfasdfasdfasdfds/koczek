import { useDispatch, useSelector, useStore, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from './store';

// Typed useDispatch
export const useAppDispatch: () => AppDispatch = useDispatch;

// Typed useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Typed useStore
export const useAppStore = () => useStore<AppStore>();
