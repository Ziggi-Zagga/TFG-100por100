<script lang="ts">
	import BackIcon from './BackIcon.svelte';
	import BuyerIcon from './BuyerIcon.svelte';
	import ChevronDown from './ChevronDown.svelte';
	import ChevronRight from './ChevronRight.svelte';
	import DateIcon from './DateIcon.svelte';
	import DeleteIcon from './DeleteIcon.svelte';
	import EditIcon from './EditIcon.svelte';
	import LocationIcon from './LocationIcon.svelte';
	import PromoteIcon from './PromoteIcon.svelte';
	import SendIcon from './SendIcon.svelte';
	import TemplateIcon from './TemplateIcon.svelte';
	import PhoneIcon from './PhoneIcon.svelte';
	import ContactMail from './ContactMail.svelte';
	import ChatIcon from './ChatIcon.svelte';
	import AddIcon from './AddIcon.svelte';
	import EventAdd from './EventAdd.svelte';
	import CloseIcon from './CloseIcon.svelte';
	import InfoIcon from './InfoIcon.svelte';
	import UserIcon from './UserIcon.svelte';
	import AlertIcon from './AlertIcon.svelte';
	import CheckIcon from './CheckIcon.svelte';
	import SpaceIcon from './SpaceIcon.svelte';
	import TodoIcon from './TodoIcon.svelte';
	import CancelledIcon from './CancelledIcon.svelte';
	import MenuIcon from './Menu.svelte';
	import ArrowIcon from './Arrow.svelte';
	
	const {
		icon,
		size = 24,
		extraStyles = '',
	}: { icon: string; size: number; extraStyles?: string } = $props();
</script>

{#if icon === 'date'}
	<DateIcon {size} />
{/if}
{#if icon === 'back'}
	<BackIcon {size} {extraStyles} />
{/if}
{#if icon === 'down'}
	<ChevronDown {size} {extraStyles} />
{/if}
{#if icon === 'location'}
	<LocationIcon {size} />
{/if}
{#if icon === 'promote'}
	<PromoteIcon {size} />
{/if}
{#if icon === 'buyer'}
	<BuyerIcon {size} />
{/if}
{#if icon === 'template'}
	<TemplateIcon {size} />
{/if}
{#if icon === 'edit'}
	<EditIcon {size} />
{/if}
{#if icon === 'delete'}
	<DeleteIcon {size} />
{/if}
{#if icon === 'send'}
	<SendIcon {size} />
{/if}
{#if icon === 'phone'}
	<PhoneIcon {size} />
{/if}
{#if icon === 'contactMail'}
	<ContactMail {size} />
{/if}
{#if icon === 'chat'}
	<ChatIcon {size} />
{/if}
{#if icon === 'add'}
	<AddIcon {size} {extraStyles} />
{/if}
{#if icon === 'eventAdd'}
	<EventAdd {size} {extraStyles} />
{/if}
{#if icon === 'close'}
	<CloseIcon {size} {extraStyles} />
{/if}
{#if icon === 'info'}
	<InfoIcon {size} {extraStyles} />
{/if}
{#if icon === 'user'}
	<UserIcon {size} {extraStyles} />
{/if}
{#if icon === 'alert'}
	<AlertIcon {size} {extraStyles} />
{/if}
{#if icon === 'right'}
	<ChevronRight {size} {extraStyles}  />
{/if}
{#if icon === 'check'}
	<CheckIcon {size} {extraStyles} />
{/if}
{#if icon === 'space'}
	<SpaceIcon {size} {extraStyles} />
{/if}
{#if icon === 'todo'}
	<TodoIcon {size} {extraStyles} />
{/if}
{#if icon === 'cancelled'}
	<CancelledIcon {size} {extraStyles} />
{/if}
{#if icon === 'menu'}
	<MenuIcon {size} {extraStyles} />
{/if}
{#if icon === 'arrow'}
	<ArrowIcon {size} {extraStyles} />
{/if}