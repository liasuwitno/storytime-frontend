import Pusher from "pusher-js";
import { ref } from "vue";

interface PusherConfig {
  appKey: string;
  cluster: string;
  channelName: string;
  eventName: string;
  enableLogging?: boolean;
}

interface PusherMessage {
  timestamp: number;
  message: string;
  slug: string;
}

interface PusherMessageSource {
  contents: {
    timestamp: number;
    message: string;
    slug: string;
  };
}

export const usePusherNotifications = (config: PusherConfig) => {
  const messages = ref<PusherMessage[]>([]);

  if (config.enableLogging) {
    Pusher.logToConsole = true;
  }

  const pusher = new Pusher(config.appKey, {
    cluster: config.cluster,
  });

  const channel = pusher.subscribe(config.channelName);

  channel.bind(config.eventName, (data: PusherMessageSource) => {
    messages.value.push({
      timestamp: Date.now(),
      message: data.contents?.message,
      slug: data.contents?.slug,
    });
  });

  const clearMessages = () => {
    messages.value = [];
  };

  const unsubscribe = () => {
    channel.unbind_all();
    pusher.unsubscribe(config.channelName);
  };

  return {
    messages,
    clearMessages,
    unsubscribe,
    pusher,
  };
};
