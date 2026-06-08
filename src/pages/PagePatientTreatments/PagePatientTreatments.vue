<script setup lang="ts">
import DrawerModifyTreatment from './components/DrawerModifyTreatment.vue';
import SubscriptionItem from './components/SubscriptionItem.vue';
import type { DrawerModifyTreatmentSubscription } from './types';
import { apiPharmacy } from '@/api/pharmacy';
import { apiTreatment } from '@/api/treatment';
import NoTreatmentPlan from '@/components/NoTreatmentPlan/NoTreatmentPlan.vue';
import ProductCarousel from '@/components/ProductCarousel/ProductCarousel.vue';
import ReactivateTreatmentDrawer from '@/components/ReactivateTreatmentDrawer/ReactivateTreatmentDrawer.vue';
// import WidgetLastMessage from '@/components/WidgetLastMessage/WidgetLastMessage.vue';
import { usePharmacy } from '@/composables/usePharmacy';
import { useTreatments } from '@/composables/useTreatments';
import { usePharmacyStore } from '@/stores/pharmacy';
import { useUserStore } from '@/stores/user';
import type { ModifiedSubscriptionItem } from '@/types/subscription';
import { waitTransition } from '@/utils/pageTransition.ts';
import { productMapper } from '@/utils/pharmacyMappers.ts';
import { scrollToHash } from '@/utils/scroll';
import { storeToRefs } from 'pinia';
import { onUpdated, ref, watch } from 'vue';

const userStore = useUserStore();

const pharmacyStore = usePharmacyStore();
const { popularPharmacyProducts } = storeToRefs(pharmacyStore);
const { getPopularPharmacy } = pharmacyStore;

await Promise.all([
  waitTransition(),
  apiPharmacy.getPharmacy(),
  apiTreatment.getTreatments.load({ patientId: userStore.userId as number }),
  getPopularPharmacy(),
]);

const { pharmacyCategories } = usePharmacy();
const { subscriptionItems, subscriptionItemsNotFiltered, refreshTreatments } = useTreatments();

const isOpenDrawerModifyTreatment = ref(false);
const isOpenDrawerReactivateTreatment = ref(false);
const isApproveMembership = ref(false);
const selectedSubscription = ref<DrawerModifyTreatmentSubscription>();
const selectedSubscriptions = ref<ModifiedSubscriptionItem[]>();

const onOpenDrawerModifyTreatment = (subscription: DrawerModifyTreatmentSubscription) => {
  selectedSubscription.value = subscription;
  isOpenDrawerModifyTreatment.value = true;
};

const onOpenDrawerReactivateTreatment = (treatmentId: number, isMembership: boolean = false) => {
  selectedSubscriptions.value = subscriptionItemsNotFiltered.value.filter(
    (item) => item.treatmentId === treatmentId,
  );
  isOpenDrawerReactivateTreatment.value = true;
  isApproveMembership.value = isMembership;
};

onUpdated(() => {
  scrollToHash({ behavior: 'smooth' });
});

watch(isOpenDrawerModifyTreatment, (value) => {
  if (!value) {
    selectedSubscription.value = undefined;
  }
});

watch(isOpenDrawerReactivateTreatment, (value) => {
  if (!value) {
    selectedSubscription.value = undefined;
  }
});
</script>

<template>
  <div class="flex flex-col gap-48" data-page-in="fadeInUp" data-page-out="fadeOutUp">
    <section v-if="subscriptionItems.length !== 0" class="row" data-testpl="patient-treatments">
      <DrawerModifyTreatment
        v-model="isOpenDrawerModifyTreatment"
        :subscription="selectedSubscription"
        @success="refreshTreatments"
      />

      <ReactivateTreatmentDrawer
        v-model="isOpenDrawerReactivateTreatment"
        :subscriptions="selectedSubscriptions"
        :is-approve-membership
        @success="refreshTreatments"
      />

      <div class="col-span-full flex flex-col gap-24">
        <h2 class="text-21 lg:text-26 font-secondary">
          {{ $t('treatments') }}
        </h2>

        <ul class="flex flex-col gap-24" data-testpl="patient-treatments-subscriptions">
          <SubscriptionItem
            v-for="subscription in subscriptionItems"
            :subscription
            :key="subscription.id"
            @open-modify-treatment="onOpenDrawerModifyTreatment"
            @open-reactivate-treatment="onOpenDrawerReactivateTreatment"
          />
        </ul>
      </div>
    </section>

    <NoTreatmentPlan v-else :title="$t('startYourTreatment')" :pharmacy-categories>
      <template #subtitle>
        <span>
          {{ $t('getFullAccessToYourNewHealthPortal') }}
        </span>
        <br />
        <span>
          {{ $t('yourTreatmentsWillAppearHereAfterYourFirstPurchase') }}
        </span>
      </template>
    </NoTreatmentPlan>

    <!-- TODO: from task - To avoid confusion and enhance user experience,
     we will hide the widget until after the launch, at which point we can develop
     a more effective solution to ensure proper message flow. -->
    <!-- <section class="row" data-testpl="patient-messages-and-follow-up-questions">
      <div class="col-span-full flex flex-col gap-24">
        <h2 class="text-21 lg:text-26 font-secondary">
          {{ $t('messagesFromYourCareTeam') }}
        </h2>

        <WidgetLastMessage hide-title />
      </div> -->

    <!-- TODO: add follow-up questions widget -->
    <!-- <div class="col-span-full flex flex-col gap-24 lg:col-span-4">
        <h2 class="text-21 lg:text-26 font-secondary">Follow-up questions</h2>
      </div> -->
    <!-- </section> -->

    <section class="row mb-40 lg:mb-56">
      <div
        v-if="popularPharmacyProducts.length > 0"
        class="col-span-full flex flex-col gap-24"
        data-testpl="treatments-popular-products"
      >
        <h3
          class="text-21 lg:text-26 font-secondary"
          data-testpl="treatments-popular-products-title"
        >
          {{ $t('popular') }}
        </h3>

        <ProductCarousel
          class="-mr-16 lg:-mr-24"
          :products="popularPharmacyProducts.map(productMapper)"
        />
      </div>
    </section>
  </div>
</template>
