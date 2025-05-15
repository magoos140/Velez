<script>
  import { goto } from '$app/navigation';
  import { login, register } from '$lib/auth.js';

  // Flags y datos comunes
  let mode = 'login'; // 'login' o 'register'
  let error = '';
  let loading = false;

  // Login
  let email = '';
  let password = '';

  // Register
  let name = '';
  let email2 = '';
  let password2 = '';

  async function handleLogin() {
    error = '';
    loading = true;
    const res = await login(email, password);
    loading = false;

    if (res.ok) {
      goto('/dashboard');
    } else {
      error = res.error;
    }
  }

  async function handleRegister() {
    error = '';
    loading = true;
    const res = await register(email2, password2, name);
    loading = false;

    if (res.ok) {
      // Tras registro, cambiamos a login automáticamente
      mode = 'login';
      // Limpia campos de login si quieres:
      email = email2;
      password = '';
    } else {
      error = res.error;
    }
  }
</script>

<div class="max-w-md mx-auto mt-16 p-6 bg-white rounded-2xl shadow-lg">
  <h1 class="text-2xl font-bold mb-6 text-center">
    {#if mode === 'login'}Iniciar Sesión{:else}Registro{/if}
  </h1>

  {#if error}
    <p class="mb-4 text-red-600 text-sm">{error}</p>
  {/if}

  {#if mode === 'login'}
    <form on:submit|preventDefault={handleLogin} class="space-y-4">
      <div>
        <label for="email" class="block mb-1 font-medium">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          required
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div>
        <label for="password" class="block mb-1 font-medium">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          required
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <button
        type="submit"
        class="w-full py-2 font-semibold rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        disabled={loading}
      >
        {#if loading}Cargando…{:else}Login{/if}
      </button>
    </form>
    <p class="mt-4 text-sm text-center">
      ¿No tienes cuenta?
      <button
        class="text-indigo-600 hover:underline ml-1"
        on:click={() => { mode = 'register'; error = ''; }}
      >
        Regístrate aquí
      </button>
    </p>
  {:else}
    <form on:submit|preventDefault={handleRegister} class="space-y-4">
      <div>
        <label for="name" class="block mb-1 font-medium">Nombre</label>
        <input
          id="name"
          type="text"
          bind:value={name}
          required
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div>
        <label for="email2" class="block mb-1 font-medium">Email</label>
        <input
          id="email2"
          type="email"
          bind:value={email2}
          required
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div>
        <label for="password2" class="block mb-1 font-medium">Password</label>
        <input
          id="password2"
          type="password"
          bind:value={password2}
          required
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <button
        type="submit"
        class="w-full py-2 font-semibold rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        disabled={loading}
      >
        {#if loading}Registrando…{:else}Registrarse{/if}
      </button>
    </form>
    <p class="mt-4 text-sm text-center">
      ¿Ya tienes cuenta?
      <button
        class="text-indigo-600 hover:underline ml-1"
        on:click={() => { mode = 'login'; error = ''; }}
      >
        Inicia sesión
      </button>
    </p>
  {/if}
</div>
