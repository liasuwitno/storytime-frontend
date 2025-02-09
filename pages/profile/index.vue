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

import {
  useAuthService,
  type ProfileResponse,
} from "~/composables/services/useAuthService";

const isLoading = ref<boolean>(false);
const profileUser = ref<ProfileResponse | null>(null);

const { getProfile } = useAuthService();

const getProfileUser = async (): Promise<void> => {
  try {
    isLoading.value = true;

    const response = await getProfile();

    if (response?.code === CODE_OK) {
      const data = response?.data as ProfileResponse;
      profileUser.value = data;
    }

    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.error({ error });
  }
};

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

onMounted(() => {
  if (!profileUser.value) getProfileUser();
});
</script>
