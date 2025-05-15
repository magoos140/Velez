<script>
  import { syncData } from '$lib/api/client.js';
  import { goto } from '$app/navigation';

  let syncing = false;
  let syncMessage = '';

  const goToWarehouseItems = () => goto('/warehouse');
  const goToCityProducts = () => goto('/products');
  const goToWarehouseCityShip = () => goto('/city');
  const goToProductMovements = () => goto('/movements');

  const syncFromVtex = async () => {
    syncing = true;
    syncMessage = '';
    try {
      await syncData();
      syncMessage = '✅ Sincronización completada correctamente.';
    } catch (e) {
      syncMessage = `❌ Error al sincronizar: ${e.message}`;
    } finally {
      syncing = false;
    }
  };
</script>

<div class="dashboard">
  <header class="header">
    <h1>Bienvenido al Dashboard</h1>
    <button class="btn-sync" on:click={syncFromVtex} disabled={syncing}>
      {#if syncing}
        ⏳ Sincronizando…
      {:else}
        🔄 Sincronizar desde VTEX
      {/if}
    </button>
  </header>

  {#if syncMessage}
    <p class="sync-message">{syncMessage}</p>
  {/if}

  <div class="buttons-grid">
    <button class="btn" on:click={goToWarehouseItems}>
      📦 Ver items por almacén
    </button>

    <button class="btn" on:click={goToCityProducts}>
      🌍 Buscar ciudades destino de un producto
    </button>

    <button class="btn" on:click={goToWarehouseCityShip}>
      🚚 Envíos: almacén → ciudad
    </button>

    <button class="btn" on:click={goToProductMovements}>
      🔀 Movimientos producto (origen‑destino)
    </button>
  </div>
</div>

<style>
  .dashboard {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: system-ui, sans-serif;
    color: #333;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .header h1 {
    font-size: 1.75rem;
  }

  .btn-sync {
    background-color: #2563eb;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-sync:hover:not(:disabled) {
    background-color: #1e40af;
  }

  .btn-sync:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .sync-message {
    text-align: center;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    color: #2563eb;
  }

  .buttons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .btn {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 1rem;
    font-size: 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s, transform 0.1s;
  }

  .btn:hover {
    background-color: #1e40af;
  }

  .btn:active {
    transform: scale(0.98);
  }
</style>
