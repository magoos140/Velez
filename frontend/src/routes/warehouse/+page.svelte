<script>
  import { onMount } from 'svelte';
  import { getWarehouseProducts } from '$lib/api/client.js';
  import { goto } from '$app/navigation';


  let warehouses = [];
  let selectedWarehouse = null;
  let error = '';
  let loading = true;
  const goToDashboard = () => goto('/dashboard');


  onMount(async () => {
    try {
      warehouses = await getWarehouseProducts();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });

  function selectWarehouse(wh) {
    selectedWarehouse = wh;
  }
</script>

{#if loading}
  <p class="loading">Cargando almacenes…</p>
{:else}
  {#if error}
    <p class="error">{error}</p>
  {:else}
    <div class="container">
      <div class="sidebar">
        <button class="btn-back" on:click={goToDashboard}>⬅ Volver al Dashboard</button>
        <h2>Almacenes</h2>
        <ul>
          {#each warehouses as wh}
            <li>
              <button
                class:selected={selectedWarehouse === wh}
                on:click={() => selectWarehouse(wh)}
              >
                {wh.warehouseName}
              </button>
            </li>
          {/each}
        </ul>
      </div>

      <div class="content">
        {#if selectedWarehouse}
          <h2>Productos en “{selectedWarehouse.warehouseName}”</h2>
          <ul class="products">
            {#each selectedWarehouse.products as p}
              <li>
                <p class="product-name">{p.productName}</p>
                <p class="sku">ID: {p.productId}</p>
                <p class="sku">SKU: {p.skuName}</p>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="hint">Selecciona un almacén para ver sus productos.</p>
        {/if}
      </div>
    </div>
  {/if}
{/if}

<style>
  .loading,
  .error {
    text-align: center;
    margin-top: 2rem;
    font-size: 1rem;
  }

  .error {
    color: red;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    max-width: 1000px;
    margin: 3rem auto;
    padding: 1rem;
  }

  .sidebar,
  .content {
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .sidebar h2,
  .content h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .sidebar li {
    margin-bottom: 0.5rem;
  }

  .sidebar button {
    width: 100%;
    padding: 0.5rem 0.75rem;
    text-align: left;
    background-color: #f2f2f2;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .sidebar button:hover {
    background-color: #e0eaff;
  }

  .sidebar button.selected {
    background-color: #d6e0ff;
    font-weight: bold;
  }

  .content .hint {
    color: #666;
    font-style: italic;
  }

  .products {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .products li {
    border-bottom: 1px solid #ddd;
    padding: 0.5rem 0;
  }

  .product-name {
    font-weight: 600;
  }

  .sku {
    color: #666;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .container {
      grid-template-columns: 1fr;
    }
  }
</style>
