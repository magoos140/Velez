<script>
  import { onMount } from 'svelte';
  import { getMovements } from '$lib/api/client.js';
  import { goto } from "$app/navigation";

  const goToDashboard = () => goto('/dashboard');

  let startDate = '2024-01-01';
  let endDate = '2024-01-31';
  let loading = false;
  let error = '';
  let movements = [];

  async function fetchMovements() {
    loading = true;
    error = '';
    try {
      movements = await getMovements(startDate, endDate);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  onMount(fetchMovements);

  function handleSearch(e) {
    e.preventDefault();
    fetchMovements();
  }
</script>

<div class="movements-container">
<button class="btn-back" on:click={goToDashboard}>⬅ Volver al Dashboard</button>
  <h1>Movimientos por Producto</h1>

  <form on:submit={handleSearch}>
    <div class="form-group">
      <div class="input-group">
        <label for="start">Desde</label>
        <input id="start" type="date" bind:value={startDate} />
      </div>
      <div class="input-group">
        <label for="end">Hasta</label>
        <input id="end" type="date" bind:value={endDate} />
      </div>
      <button type="submit">Buscar</button>
    </div>
  </form>

  {#if loading}
    <p class="info">Cargando movimientos...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if movements.length === 0}
    <p class="info">No se encontraron movimientos en este rango.</p>
  {:else}
    <ul class="movements-list">
      {#each movements as m}
        <li>
          <p class="product">{m.productName} ({m.skuName})</p>
          <p class="details">
            Ciudad: {m.cityName}, {m.state}, {m.country} <br />
            Almacén: {m.warehouseName} <br />
            Fecha: {new Date(m.invoicedDate).toLocaleDateString()}
          </p>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .movements-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #ffffff;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    font-family: sans-serif;
  }

  h1 {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }

  form {
    margin-bottom: 2rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: 600px) {
    .form-group {
      flex-direction: row;
      align-items: flex-end;
    }
  }

  .input-group {
    display: flex;
    flex-direction: column;
  }

  label {
    font-size: 0.875rem;
    color: #555;
    margin-bottom: 0.25rem;
  }

  input[type="date"] {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.375rem;
    font-size: 1rem;
  }

  button {
    background-color: #3b82f6;
    color: white;
    padding: 0.6rem 1rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #1e40af;
  }

  .info {
    color: #555;
    font-style: italic;
  }

  .error {
    color: red;
    font-weight: bold;
  }

  .movements-list {
    list-style: none;
    padding: 0;
  }

  .movements-list li {
    padding-bottom: 1rem;
    border-bottom: 1px solid #ddd;
    margin-bottom: 1rem;
  }

  .product {
    font-weight: bold;
  }

  .details {
    color: #555;
    font-size: 0.95rem;
    margin-top: 0.3rem;
  }
</style>
