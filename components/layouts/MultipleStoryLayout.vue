<template>
  <LayoutsSEOLayout :title="pageTitle">
    <div :class="cn('pt-14')">
      <div :class="cn('max-w-7xl mx-auto mt-9 mb-6')">
        <h3
          :class="
            cn('text-4xl font-bold tracking-tight font-mono', {
              capitalize: variant === 'category',
            })
          "
        >
          {{ props.headingTitle ?? "" }}
        </h3>
      </div>

      <div :class="cn('bg-[#F0F5ED] mb-14')">
        <UiBreadcrumb :class="cn('max-w-7xl mx-auto font-semibold py-7')">
          <UiBreadcrumbList>
            <UiBreadcrumbItem>
              <NuxtLink
                :class="
                  cn('text-asparagus text-base', 'hover:text-asparagus/80')
                "
                href="/"
              >
                Home
              </NuxtLink>
            </UiBreadcrumbItem>

            <template v-if="variant === 'searching'">
              <UiBreadcrumbSeparator />
              <UiBreadcrumbItem>
                <p
                  :class="
                    cn(
                      'text-asparagus text-base capitalize',
                      'hover:text-asparagus/80'
                    )
                  "
                >
                  Search Result
                </p>
              </UiBreadcrumbItem>
            </template>

            <template v-else>
              <UiBreadcrumbSeparator />
              <UiBreadcrumbItem>
                <p
                  :class="
                    cn(
                      'text-asparagus text-base capitalize',
                      'hover:text-asparagus/80'
                    )
                  "
                >
                  Category
                </p>
              </UiBreadcrumbItem>
              <UiBreadcrumbSeparator />
              <UiBreadcrumbItem>
                <NuxtLink
                  :class="
                    cn(
                      'text-asparagus text-base capitalize',
                      'hover:text-asparagus/80'
                    )
                  "
                  :href="`/stories/categories/${params?.category}`"
                >
                  {{
                    changeToNormalText(params?.category as string, "trainCase")
                  }}
                </NuxtLink>
              </UiBreadcrumbItem>
            </template>
          </UiBreadcrumbList>
        </UiBreadcrumb>
      </div>

      <LayoutsCommonLayout container="lg">
        <slot />
      </LayoutsCommonLayout>
    </div>
  </LayoutsSEOLayout>
</template>

<script setup lang="ts">
interface MultipleStoryLayoutProps {
  pageTitle: string | null;
  variant: "searching" | "category";
  headingTitle: string | null;
  params?: {
    category: string;
  };
}

const props = defineProps<MultipleStoryLayoutProps>();
</script>
