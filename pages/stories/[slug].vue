<!-- <template>
  <LayoutsCommonLayout container="lg">
    <div :class="cn('pt-24')">
      <section class="block">
        <ModulesStoryDetailHeader
          :users="mockUser"
          :createdAt="new Date().toISOString()"
          title="Cara makan daging dengan baik dan benar"
        />
      </section>

      <section
        :class="
          cn(
            'mt-10 grid grid-cols-1 gap-4',
            'md:grid-cols-3',
            'lg:mt-14 lg:gap-6'
          )
        "
      >
        <div class="col-span-1 content-images">
          <div class="grid grid-cols-3 gap-4">
            <div
              v-for="(image, index) in MOCK_IMAGES"
              :key="image.id"
              :class="[
                'rounded-md overflow-hidden cursor-pointer',
                {
                  'col-span-3': index === 0,
                  'col-span-1': index !== 0,
                },
              ]"
              @click="handleImageClick(index)"
            >
              <NuxtImg
                :src="image?.image ?? ''"
                :alt="'Image ' + index"
                :class="[
                  'w-full object-cover',
                  {
                    'h-72': index === 0,
                    'h-28': index !== 0,
                  },
                ]"
              />
            </div>
          </div>
        </div>

        <div class="col-span-2">
          At their new headquarters on Knowhere,[a] the Guardians of the
          Galaxy are attacked by Adam Warlock, a Sovereign warrior created by
          their high priestess Ayesha.[b] After Adam overpowers them and
          critically wounds Rocket, he is stabbed by Nebula and forced to flee.
          The Guardians are unable to tend to Rocket's wounds due to a kill
          switch, made by the company Orgocorp, embedded in him. They travel to
          Orgocorp's headquarters to find the override code. As Rocket lies
          unconscious, he recalls his past. As a baby raccoon, he was
          experimented on by the High Evolutionary, a scientist who sought to
          enhance and anthropomorphize animal lifeforms to create
          a Counter-Earth. Rocket befriended the High Evolutionary's other test
          subjects: the otter Lylla, the walrus Teefs, and the rabbit Floor. The
          High Evolutionary was impressed by Rocket's intelligence but furious
          that it exceeded his own. The High Evolutionary perfected his
          experiments with Rocket's advice but ordered Rocket's brain to be
          extracted and his friends incinerated. Rocket freed Lylla, only for
          the High Evolutionary to kill her. Rocket mauled the High Evolutionary
          and shot his guards, but Teefs and Floor were killed in the chaos.
          Alone, Rocket stole a spaceship and fled. In the present, the
          alternate version of Gamora,[c] who has joined the Ravagers, helps the
          Guardians infiltrate Orgocorp. They retrieve Rocket's file but
          discover that the code has been removed. The group speculates that
          Theel, one of the High Evolutionary's advisors, has it, so they depart
          for Counter-Earth. They are followed by Ayesha and Adam, who are
          ordered by their creator, the High Evolutionary, to retrieve Rocket
          for his brain. Upon arriving, the team is helped by residents in
          tracing Theel to the High Evolutionary's ship. Drax and Mantis remain
          with Gamora and Rocket as Peter Quill, Groot, and Nebula travel to the
          High Evolutionary's ship. Nebula is forced to wait outside by guards
          as Quill and Groot board. Drax and Mantis pursue Quill's group. The
          High Evolutionary initiates his destruction and planned recreation of
          Counter-Earth, which kills all life on the planet, including Ayesha.
          As his ship enters orbit, Quill and Groot leap off and kill Theel,
          retrieving the code from him. Gamora arrives with their ship to rescue
          them, while Nebula, Mantis, and Drax board the High Evolutionary's
          ship to escape the planet. As Quill's group attempts to access the
          code, Rocket flatlines and has a near-death experience, where he
          reunites with Lylla, Teefs, and Floor. Lylla tells him that his time
          has not yet come as Quill uses the code to disable the kill switch and
          save Rocket's life. Nebula, Mantis, and Drax come across hundreds of
          imprisoned humanoid children on the High Evolutionary's ship before
          being captured. Quill's group sets out to rescue the three, who are
          placed in a chamber with monstrous Abilisks. Mantis befriends the
          Abilisks, allowing the group to escape and reunite with Quill's group,
          together overpowering the High Evolutionary's
          army. Kraglin and Cosmo arrive on Knowhere, and Cosmo creates
          a telekinetic tunnel connecting Knowhere to the High Evolutionary's
          ship to free the captured children. Rocket discovers imprisoned
          animals on the ship before being attacked by the High Evolutionary,
          but the rest of the Guardians help subdue him, leaving him to perish
          on his ship. The Guardians rescue the animals and lead them aboard
          Knowhere. Quill nearly dies trying to cross over but is saved by Adam,
          who had a change of heart after being saved by Groot. In the
          aftermath, Quill leaves the Guardians, bestowing the captaincy to
          Rocket before leaving for Earth to reunite with his grandfather Jason.
          Mantis embarks on a journey of self-discovery with the Abilisks,
          Gamora reunites with the Ravagers, and Nebula and Drax remain on
          Knowhere to raise the rescued children. In a mid-credits scene, the
          new Guardians, consisting of Rocket, Groot, Cosmo, Kraglin,
          Adam, Phyla (one of the rescued children), and Adam's pet Blurp, take
          on a new mission. In a post-credits scene, Quill eats breakfast with
          Jason.
        </div>
      </section>

      <section class="mt-52">
        <UiSectionBar title="Similar Story" :isShowExploreMore="false" />
        <StoryModuleLayout
          :stories="FIND_THREE_MOCK_DATA"
          variant="list"
          hasCategory
        />
      </section>
    </div>
  </LayoutsCommonLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";

const mockUser = {
  name: "John Doe",
  avatar: "https://randomuser.me/api/portraits",
};

const MOCK_IMAGES = ref(
  MOCK_DATA.map((item) => ({
    id: item.id,
    image: item.banner,
  })).slice(0, 4)
);

const handleImageClick = (clickedIndex: number): void => {
  if (clickedIndex === 0) return;

  const newImages = [...MOCK_IMAGES.value];
  const [clickedImage] = newImages.splice(clickedIndex, 1);
  newImages.unshift(clickedImage);

  MOCK_IMAGES.value = newImages;
};
</script> -->

<template lang="">
  <div>{{ route.params.slug ?? "-" }}</div>
</template>
<script setup lang="ts">
const route = useRoute();
</script>
<style lang=""></style>
