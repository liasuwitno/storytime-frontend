<template>
  <LayoutsSEOLayout title="Profile">
    <LayoutsCommonLayout>
      <div class="min-h-screen">
        <ModulesProfileBanner :profile="profileUser" />

        <section :class="cn('max-w-7xl mx-auto mt-12')">
          <Tabs :default-value="TABS[0].name.toLowerCase()">
            <TabsList class="bg-white">
              <TabsTrigger
                v-for="tab in TABS"
                :key="tab.id"
                :value="tab.name.toLowerCase()"
                :class="
                  cn(
                    'data-[state=active]:bg-[#F0F5ED] data-[state=active]:text-raisin-black font-medium',
                    'py-5 px-6 text-base'
                  )
                "
              >
                {{ tab.name }}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my story">
              <LayoutsProfileLayout>
                <ModulesProfileMyStory />
              </LayoutsProfileLayout>
            </TabsContent>
            <TabsContent value="bookmark">
              <LayoutsProfileLayout>
                <ModulesProfileBookmark />
              </LayoutsProfileLayout>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </LayoutsCommonLayout>
  </LayoutsSEOLayout>
</template>
<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ModulesProfileMyStory from "~/components/modules/Profile/ProfileMyStory.vue";
import ModulesProfileBookmark from "~/components/modules/Profile/ProfileBookmark.vue";

import { useAuthenticationStore } from "~/stores/auth";

const store = useAuthenticationStore();
const profileUser = computed(() => store.userProfile);

const TABS = [
  {
    id: 1,
    name: "My Story",
  },
  {
    id: 2,
    name: "Bookmark",
  },
];
</script>
