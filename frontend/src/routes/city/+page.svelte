<script>
  import { getDestinationCities } from "$lib/api/client.js";
  import { goto } from "$app/navigation";

  const goToDashboard = () => goto('/dashboard');

  let cityId = '';
  let warehouses = [];
  let error = '';
  let searched = false;

  const getWarehouses = async () => {
    error = '';
    warehouses = [];
    searched = false;

    if (!cityId.trim()) {
      error = 'Por favor, ingresa un ID de ciudad válido.';
      return;
    }

    try {
      const result = await getDestinationCities(cityId);
      if (result.length === 0) {
        error = 'No se encontraron almacenes que envíen a esta ciudad.';
      } else {
        warehouses = result;
      }
    } catch (e) {
      error = e.message || 'Ocurrió un error al buscar.';
    } finally {
      searched = true;
    }
  };
</script>

<button class="btn-back" on:click={goToDashboard}>⬅ Volver al Dashboard</button>

<div class="container">
  <h2>Buscar almacenes que envían a una ciudad</h2>
  <p>Ingresa el ID de una ciudad para ver desde qué almacenes se envían productos a ella.</p>

  <div class="form">
    <input
      type="text"
      placeholder="ID de la ciudad"
      bind:value={cityId}
    />
    <button on:click={getWarehouses}>🔍 Buscar</button>
  </div>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  {#if warehouses.length > 0}
    <div class="results">
      <h3>Almacenes encontrados:</h3>
      <ul>
        {#each warehouses as wh}
          <li>
            <strong>{wh.name}</strong> (ID: {wh.warehouseId})
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if searched && warehouses.length === 0 && !error}
    <p class="hint">No se encontraron almacenes para esta ciudad.</p>
  {/if}
</div>

<style>
  .btn-back {
    display: block;
    margin: 2rem auto 0;
    background-color: #2563eb;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-back:hover {
    background-color: #1e40af;
  }

  .container {
    max-width: 700px;
    margin: 3rem auto;
    padding: 1.5rem;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    font-family: system-ui, sans-serif;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 1.5rem;
    color: #444;
  }

  .form {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .form input {
    flex: 1;
    padding: 0.6rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  .form button {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .form button:hover {
    background-color: #1e40af;
  }

  .error {
    color: red;
    margin-top: -1rem;
    margin-bottom: 1.5rem;
  }

  .results {
    margin-top: 2rem;
  }

  .results h3 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .results ul {
    list-style: none;
    padding: 0;
  }

  .results li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #ddd;
  }

  .hint {
    color: #666;
    font-style: italic;
  }
</style>
