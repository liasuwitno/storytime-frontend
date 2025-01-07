<template>
  <div
    v-if="DATA?.length < 1"
    :class="
      cn('flex items-center justify-center text-center col-span-2 flex-col')
    "
  >
    <h3
      class="font-bold text-raisin-black text-4xl tracking-tight font-mono mb-3"
    >
      No Stories Yet
    </h3>
    <p :class="cn('text-charcoal-gray text-lg font-medium')">
      You haven't shared any stories yet. Start your fitness journey today!
    </p>

    <figure class="text-center mt-7">
      <NuxtImg
        src="/images/no-stories-yet.svg"
        alt="no-stories-illustration"
        :class="cn('h-80 w-auto inline-block')"
      />
    </figure>
  </div>

  <div v-else v-for="(story, index) in DATA" :key="story.id">
    <UiCardItem
      isMultipleMethod
      variant="list"
      :story="story"
      :url="`/stories/${story.id}`"
      :index="index"
      :methods="{
        bookmarkOnClick: () => {},
        deleteOnClick: () => {},
        updateOnClick: () => {},
      }"
    />
  </div>
</template>

<script setup lang="ts">
const DATA = [
  {
    id: 1,
    title: "The Last of Us 6",
    author_name: "John Doe",
    created_at: new Date().toISOString(),
    category_name: "horror",
    avatar:
      "https://dl.dropbox.com/scl/fi/xpzps77me2votw6y204ny/avatar-2.png?rlkey=fcr27tau2wffcugzlxq41bi26&st=82hsf9kj&dl=0",
    body: "Seperti hari-hari biasa, aku bangun pagi, sarapan dan pergi ke stasuin untuk naik kereta dan berangkat kerja. Hari ini cukup lambat karena nampaknya kereta akan telat datang sekitar 10 menit. Aku dan orang-orang yang memiliki tujuan yang sama ini hanya menunggu di kursi sebelum kereta datang. 15 menit. Itulah waktu yang",
    banner:
      "https://images.unsplash.com/photo-1733970532531-c1eb5bbb165f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "The Last of Us 7",
    author_name: "John Doe",
    created_at: new Date().toISOString(),
    category_name: "horror",
    avatar:
      "https://dl.dropbox.com/scl/fi/xpzps77me2votw6y204ny/avatar-2.png?rlkey=fcr27tau2wffcugzlxq41bi26&st=82hsf9kj&dl=0",
    body: "Seperti hari-hari biasa, aku bangun pagi, sarapan dan pergi ke stasuin untuk naik kereta dan berangkat kerja. Hari ini cukup lambat karena nampaknya kereta akan telat datang sekitar 10 menit. Aku dan orang-orang yang memiliki tujuan yang sama ini hanya menunggu di kursi sebelum kereta datang. 15 menit. Itulah waktu yang",
    banner:
      "https://images.unsplash.com/photo-1733970532531-c1eb5bbb165f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "The Last of Us 8",
    author_name: "John Doe",
    created_at: new Date().toISOString(),
    category_name: "horror",
    avatar:
      "https://dl.dropbox.com/scl/fi/xpzps77me2votw6y204ny/avatar-2.png?rlkey=fcr27tau2wffcugzlxq41bi26&st=82hsf9kj&dl=0",
    body: "Seperti hari-hari biasa, aku bangun pagi, sarapan dan pergi ke stasuin untuk naik kereta dan berangkat kerja. Hari ini cukup lambat karena nampaknya kereta akan telat datang sekitar 10 menit. Aku dan orang-orang yang memiliki tujuan yang sama ini hanya menunggu di kursi sebelum kereta datang. 15 menit. Itulah waktu yang",
    banner:
      "https://images.unsplash.com/photo-1733970532531-c1eb5bbb165f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    title: "The Last of Us 4",
    author_name: "John Doe",
    created_at: new Date().toISOString(),
    category_name: "horror",
    avatar:
      "https://dl.dropbox.com/scl/fi/xpzps77me2votw6y204ny/avatar-2.png?rlkey=fcr27tau2wffcugzlxq41bi26&st=82hsf9kj&dl=0",
    body: "Seperti hari-hari biasa, aku bangun pagi, sarapan dan pergi ke stasuin untuk naik kereta dan berangkat kerja. Hari ini cukup lambat karena nampaknya kereta akan telat datang sekitar 10 menit. Aku dan orang-orang yang memiliki tujuan yang sama ini hanya menunggu di kursi sebelum kereta datang. 15 menit. Itulah waktu yang",
    banner:
      "https://images.unsplash.com/photo-1733970532531-c1eb5bbb165f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    title: "The Last of Us 5",
    author_name: "John Doe",
    created_at: new Date().toISOString(),
    category_name: "horror",
    avatar:
      "https://dl.dropbox.com/scl/fi/xpzps77me2votw6y204ny/avatar-2.png?rlkey=fcr27tau2wffcugzlxq41bi26&st=82hsf9kj&dl=0",
    body: "Seperti hari-hari biasa, aku bangun pagi, sarapan dan pergi ke stasuin untuk naik kereta dan berangkat kerja. Hari ini cukup lambat karena nampaknya kereta akan telat datang sekitar 10 menit. Aku dan orang-orang yang memiliki tujuan yang sama ini hanya menunggu di kursi sebelum kereta datang. 15 menit. Itulah waktu yang",
    banner:
      "https://images.unsplash.com/photo-1733970532531-c1eb5bbb165f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
</script>
