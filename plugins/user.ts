import { Plugin } from '@nuxt/types';

interface UserStore {
  set: (
    id: string,
    serverUrl: string,
    accessToken: string,
    apiKey: string
  ) => void;
  clear: () => void;
}

declare module '@nuxt/types' {
  interface Context {
    $user: UserStore;
  }

  interface NuxtAppOptions {
    $user: UserStore;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $user: UserStore;
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $user: UserStore;
  }
}

const userPlugin: Plugin = (context, inject) => {
  const user = {
    set: async (
      id: string,
      serverUrl: string,
      accessToken: string,
      apiKey: string
    ) => {
      const response = await context.$displayPreferencesApi.getDisplayPreferences(
        { displayPreferencesId: 'usersettings', userId: id, client: 'vue' }
      );

      context.store.commit('user/set', {
        id,
        serverUrl,
        accessToken,
        displayPreferences: response.data.CustomPrefs,
        apiKey
      });
    },
    clear: () => {
      context.store.commit('user/clear');
    }
  };

  inject('user', user);
};

export default userPlugin;
