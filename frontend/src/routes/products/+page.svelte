<script>
  import { getCitiesByProduct } from "$lib/api/client.js";
  import { goto } from "$app/navigation";

  const goToDashboard = () => goto('/dashboard');

  let productId = '';
  let cities = [];
  let error = '';
  let searched = false;

  const getCities = async () => {
    error = '';
    cities = [];
    searched = false;

    if (!productId.trim()) {
      error = 'Por favor, ingresa un ID de producto válido.';
      return;
    }

    try {
      const result = await getCitiesByProduct(productId);
      if (result.length === 0) {
        error = 'No se encontraron ciudades para este producto.';
      } else {
        cities = result;
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
  <h2>Buscar ciudades destino de un producto</h2>
  <p>Ingresa el ID de un producto para ver a qué ciudades se envía desde los almacenes disponibles.</p>

  <div class="form">
    <input
      type="text"
      placeholder="ID del producto"
      bind:value={productId}
    />
    <button on:click={getCities}>🔍 Buscar</button>
  </div>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  {#if cities.length > 0}
    <div class="results">
      <h3>Ciudades encontradas:</h3>
      <ul>
        {#each cities as city}
          <li>
            <strong>{city.name}</strong> — {city.state}, {city.country} - <strong>ID:</strong> {city.cityId}
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if searched && cities.length === 0 && !error}
    <p class="hint">No se encontraron ciudades para este producto.</p>
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
