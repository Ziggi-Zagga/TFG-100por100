<script lang="ts">
	import Modal from '$lib/components/utilities/Modal/Modal.svelte';
	import type { Product, Supplier, Manufacturer, Category } from '$lib/types/products.types';

	const {
		isOpen = false,
		onClose = () => {},
		product = null,
		suppliers = [],
		manufacturers = [],
		categories = []
	} = $props<{
		isOpen?: boolean;
		onClose?: () => void;
		product: Product | null;
		suppliers?: Supplier[];
		manufacturers?: Manufacturer[];
		categories?: Category[];
	}>();

	const getSupplierName = $derived((id: string): string => {
		const supplier = suppliers.find((s: any) => s.id === id);
		return supplier?.name || 'No especificado';
	});

	const getManufacturerName = $derived((id: string): string => {
		const manufacturer = manufacturers.find((m: any) => m.id === id);
		return manufacturer?.name || 'No especificado';
	});

	const getCategoryName = $derived((id: string): string => {
		const category = categories.find((c: any) => c.id === id);
		return category?.name || 'No especificada';
	});

	const formatCurrency = $derived((value: number | undefined): string => {
		if (!value) return 'N/A';
		return new Intl.NumberFormat('es-ES', {
			style: 'currency',
			currency: 'EUR'
		}).format(value);
	});

	const formatDate = $derived((dateString: string | undefined): string => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? 'Fecha inválida' : date.toLocaleDateString('es-ES');
	});
</script>

{#if isOpen}
	<Modal title="Información del Producto" {onClose} size="md">
		<div class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<h3 class="text-lg font-medium text-gray-900">Información General</h3>
					<dl class="mt-2 space-y-2">
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Código</dt>
							<dd class="text-sm text-gray-900">{product?.code || 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Nombre</dt>
							<dd class="text-sm text-gray-900">{product?.name || 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Precio</dt>
							<dd class="text-sm text-gray-900">{formatCurrency(product?.price)}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Stock actual</dt>
							<dd class="text-sm text-gray-900">{product?.stock || 0} unidades</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Proveedor</dt>
							<dd class="text-sm text-gray-900">
								{product?.supplierId ? getSupplierName(product.supplierId) : 'No especificado'}
							</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Fabricante</dt>
							<dd class="text-sm text-gray-900">
								{product?.manufacturerId ? getManufacturerName(product.manufacturerId) : 'No especificado'}
							</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Categoría</dt>
							<dd class="text-sm text-gray-900">
								{product?.categoryId ? getCategoryName(product.categoryId) : 'No especificada'}
							</dd>
						</div>
					</dl>
				</div>

				<div>
					<h3 class="text-lg font-medium text-gray-900">Detalles</h3>
					<dl class="mt-2 space-y-2">
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Proveedor</dt>
							<dd class="text-sm text-gray-900">{product?.supplier?.name || 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Fabricante</dt>
							<dd class="text-sm text-gray-900">{product?.manufacturer?.name || 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Categoría</dt>
							<dd class="text-sm text-gray-900">{product?.category?.name || 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Unidad</dt>
							<dd class="text-sm text-gray-900">{product?.unit || 'N/A'}</dd>
						</div>
					</dl>
				</div>
			</div>

			<!-- Descripción -->
			<div class="border-t border-gray-200 pt-4">
				<h3 class="text-lg font-medium text-gray-900">Descripción</h3>
				<p class="mt-2 text-sm text-gray-700">
					{product?.description || 'No hay descripción disponible para este producto.'}
				</p>
			</div>

			<!-- Especificaciones -->
			{#if product?.specifications || product?.dimensions || product?.material}
				<div class="border-t border-gray-200 pt-4">
					<h3 class="text-lg font-medium text-gray-900">Especificaciones Técnicas</h3>
					<dl class="mt-2 space-y-2">
						{#if product?.dimensions}
							<div class="flex justify-between">
								<dt class="text-sm font-medium text-gray-500">Dimensiones</dt>
								<dd class="text-sm text-gray-900">{product.dimensions}</dd>
							</div>
						{/if}
						{#if product?.material}
							<div class="flex justify-between">
								<dt class="text-sm font-medium text-gray-500">Material</dt>
								<dd class="text-sm text-gray-900">{product.material}</dd>
							</div>
						{/if}
						{#if product?.specifications}
							<div class="flex justify-between">
								<dt class="text-sm font-medium text-gray-500">Especificaciones</dt>
								<dd class="text-sm text-gray-900">{product.specifications}</dd>
							</div>
						{/if}
					</dl>
				</div>
			{/if}

			<!-- Fechas -->
			<div class="border-t border-gray-200 pt-4">
				<h3 class="text-lg font-medium text-gray-900">Registro</h3>
				<dl class="mt-2 space-y-2">
					<div class="flex justify-between">
						<dt class="text-sm font-medium text-gray-500">Fecha de creación</dt>
						<dd class="text-sm text-gray-900">{formatDate(product?.createdAt)}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-sm font-medium text-gray-500">Última actualización</dt>
						<dd class="text-sm text-gray-900">{formatDate(product?.updatedAt)}</dd>
					</div>
				</dl>
			</div>
		</div>
	</Modal>
{/if}