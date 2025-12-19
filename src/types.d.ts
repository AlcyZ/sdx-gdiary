import type { IDBPTransaction } from 'idb'
import type { CheckedState } from 'radix-vue/dist/Menu/utils'
import type { Component, Ref, SetupContext, VNodeChild } from 'vue'

/**
 * Represents a result type that can either hold a successful value of type `T` or an error value of type `E`.
 *
 * @template T - The type of the successful value.
 * @template E - The type of the error value.
 */
type Result<T, E> = Ok<T> | Err<E>

/**
 * Represents a successful result value containing a value of type `T`.
 *
 * @template T - The type of the successful value.
 */
interface Ok<T> { ok: true, value: T }

/**
 * Represents an error result value containing an error value of type `E`.
 *
 * @template E - The type of the error value.
 */
interface Err<E> { ok: false, error: E }

interface Some<T> { exist: true, value: T }

interface None { exist: false }

type Option<T> = Some<T> | None

type ResultOrOption<T, E = any> = Result<T, E> | Option<T>

type AsyncResult<T, E> = Promise<Result<T, E>>

type AsyncArray<T> = Promise<Array<T>>

type Scalar = string | number | boolean | null | undefined | symbol | bigint

interface HasId<T> {
  id: T
}

type WithId<T, I> = T & HasId<I>

type Attrs = SetupContext<any>['attrs']

interface HasTimestamps {
  createdAt: string
  updatedAt: string
}

interface HasLabel {
  label: string
}

interface HasLabelNoContent {
  label: string
  content?: never
}

interface HasContentNoLabel {
  label?: never
  content: VNodeChild
}

type HasContentOrLabel = HasLabelNoContent | HasContentNoLabel

interface DockItem {
  icon: Component
  label: string
  to: string
}

interface ListItem {
  title: string
  text: string
  image: string
  actions: Array<ListItemAction>
}

interface DropdownItemLegacy {
  label: string
  icon?: Component
  onClick?: () => unknown
}

type DropdownMenuItem = {
  type: 'item'
  onClick?: () => any
} & HasContentOrLabel

interface DropdownMenuSeparator {
  type: 'separator'
}

type DropdownMenuSub = {
  type: 'sub'
  items: Array<DropdownMenu>
} & HasContentOrLabel

type DropdownMenuCheckboxItem = {
  type: 'checkbox'
  checked: CheckedState
} & HasContentOrLabel

interface DropdownMenuRadioGroup {
  type: 'radio'
  selected: T
  items: Array<DropdownMenuRadioGroupItem>
}

type DropdownMenuRadioGroupItem = HasContentOrLabel & {
  value: string
}

type DropdownMenuLabel = {
  type: 'label'
} & HasContentOrLabel

type DropdownMenu = DropdownMenuItem
  | DropdownMenuSeparator
  | DropdownMenuSub
  | DropdownMenuCheckboxItem
  | DropdownMenuRadioGroup
  | DropdownMenuLabel

interface ListItemAction {
  icon: Component
  onClick?: () => void | Promise<void>
}

interface FabAction {
  icon: Component
  onClick?: () => unknown
}

interface TopNavigationProps {
  back?: () => any
  title?: Ref<string>
  actions?: Array<TopNavigationAction>
}

type TopNavigationAction = DropdownMenu

interface LayoutConfig {
  dock?: boolean
  topNavigation?: TopNavigationProps | true
}

type ComponentCssClass = string | Record<string, boolean> | Array<ComponentCssClass>

interface ToastProps {
  message: string
  variant?: ToastVariant
  position?: ToastPosition
  duration?: number | undefined
  class?: ComponentCssClass
}
type ToastPosition = 'ts' | 'tc' | 'te' | 'ms' | 'mc' | 'me' | 'bs' | 'bc' | 'be'
type ToastVariant = 'info' | 'warning' | 'success' | 'error'

type BaseVariant = 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
type BaseSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type StepVariant = BaseVariant

type BadgeVariant = BaseVariant
type BadgeSize = BaseSize

type ButtonVariant = BaseVariant
type ButtonSize = BaseSize

type InputSize = BaseSize
type SelectSize = BaseSize

type AlertVariant = Exclude<BaseVariant, 'neutral' | 'primary' | 'secondary' | 'accent'>

type LoadingSize = BaseSize
type LoadingType = 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity'

type ResponsiveBreakpoint = 'sm' | 'md' | 'lg' | 'xl'

type FormError<T extends object> = {
  [K in keyof T]?: string
}

interface ShowConfirmationModalAction {
  label: string
  onClick: () => any
  class?: ComponentCssClass
  type?: 'button' | 'submit'
  icon?: Component
}

interface ShowConfirmationModalProps {
  title: string
  text?: string
  onEnter?: () => any
  actions: Array<ShowConfirmationModalAction>
}

interface ParseJsonErrorParse {
  kind: 'parse'
  error: unknown
}

interface ParseJsonErrorTypeGuard {
  kind: 'guard'
}

type ParseJsonError = (ParseJsonErrorParse | ParseJsonErrorTypeGuard) & {
  payload?: any
}

interface TransitionIndex {
  h: number
  v: number
}

// idb util types
type Transaction<Mode extends IDBTransactionMode = 'readonly'> = IDBPTransaction<any, ArrayLike<string>, Mode>

type StoreFrom<T extends Transaction<any>> = T['objectStoreNames'][number]

type EnsureStore<Store, Tx extends Transaction<any>>
  = Store extends StoreFrom<Tx> ? Tx : never

type FromToAnimation = 'from' | 'to'
