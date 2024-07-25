import test, { expect } from '@playwright/test';

import { routeRegex, routes } from '@/constants/routes';
import { tenantGroupIdMap } from '@/containers/quotations/constants';
import { removeSpaceFromString } from '@/utils/common';

import {
  createOpportunityInputTestDataForQuotation,
  createQuotationData,
  editProductData,
} from '../../constants/quotationData';
import { opportunityTestIds, proposalTestIds } from '../../constants/testIds';
import { getIdFromUrl } from '../../utils/common/getIdFromUrl';
import {
  addProductLineGroup,
  checkProductFormFilledCorrectly,
  createNewEmptyQuotation,
  deleteLineItemGroup,
  deleteQuotation,
  editProduct,
  navigateToOpportunityDetails,
  navigateToQuotationEdit,
} from '../../utils/quotations/quotationFormHelpers';

let quotationId: string = '';
let opportunityId: string = '';
let newQuotationName: string = '';

test.beforeEach(async ({ page }) => {
  const opportunityDetailsUrl = `${routes.opportunity.opportunities}/${opportunityId}/details`;
  if (!page.url().includes(opportunityDetailsUrl) && opportunityId) {
    await page.goto(opportunityDetailsUrl);
  } else if (!opportunityId) {
    await navigateToOpportunityDetails(
      page,
      createOpportunityInputTestDataForQuotation
    );

    opportunityId = getIdFromUrl(page);
  }

  if (opportunityId) {
    expect(page.url().includes(opportunityDetailsUrl));
  }
});

test('Create a new quotation without any line group item', async ({ page }) => {
  newQuotationName = await createNewEmptyQuotation(
    page,
    createOpportunityInputTestDataForQuotation,
    createQuotationData,
    true
  );
});

test('Add product to existing quotation', async ({ page }) => {
  if (createQuotationData?.lineGroupItems?.[0]?.products?.[0]) {
    const quotationEllipsisMenuIcon = await page.getByTestId(
      `${newQuotationName}${proposalTestIds.ellipsisMenuIcon}`
    );
    await expect(async () => {
      expect(quotationEllipsisMenuIcon).toBeVisible();
      await quotationEllipsisMenuIcon.click();
    }).toPass();

    const editQuotationMenuItem = await page.getByTestId(
      proposalTestIds.ellipsisMenuItemEditQuotation
    );

    await editQuotationMenuItem.click();
    await addProductLineGroup({
      page,
      productData: createQuotationData.lineGroupItems[0].products[0],
    });

    await checkProductFormFilledCorrectly({
      page,
      productName: createQuotationData.lineGroupItems[0].products[0].name,
      productValues: createQuotationData.lineGroupItems[0].products[0],
    });

    const editQuotationBtn = await page.getByTestId(
      `${proposalTestIds.editQuotationBtn}-save-btn`
    );

    quotationId = getIdFromUrl(page);

    await expect(editQuotationBtn).toBeVisible();

    await editQuotationBtn.click();

    await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesDetails);
  }
});

test('Check created product saved correctly', async ({ page }) => {
  if (createQuotationData?.lineGroupItems?.[0]?.products?.[0]) {
    await navigateToQuotationEdit({
      page,
      quotationId,
      opportunityId,
      newQuotationName,
    });

    // Checking previously saved data is there or corrupted
    await checkProductFormFilledCorrectly({
      page,
      productName: createQuotationData.lineGroupItems[0].products[0].name,
      productValues: createQuotationData.lineGroupItems[0].products[0],
    });
  }
});

test('Edit product in quotation', async ({ page }) => {
  if (createQuotationData?.lineGroupItems?.[0]?.products?.[0]) {
    await navigateToQuotationEdit({
      page,
      quotationId,
      opportunityId,
      newQuotationName,
    });

    // Editing the product value
    await editProduct({
      page,
      productName: createQuotationData.lineGroupItems[0].products[0].name,
      newProductData: editProductData,
    });

    // Checking correctly edited the product values
    await checkProductFormFilledCorrectly({
      page,
      productName: editProductData.name,
      productValues: editProductData,
    });

    const editQuotationBtn1 = await page.getByTestId(
      `${proposalTestIds.editQuotationBtn}-save-btn`
    );
    // Save the quotation
    await expect(editQuotationBtn1).toBeVisible();
    await editQuotationBtn1.click();

    await expect(async () => {
      await page
        .getByTestId(opportunityTestIds.addQuotationButton)
        .waitFor({ state: 'attached' });
    }).toPass();

    await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesDetails);

    // Opening the quotation again to check the product is saved correctly after editing the product in quotation
    await navigateToQuotationEdit({
      page,
      quotationId,
      opportunityId,
      newQuotationName,
    });
    await checkProductFormFilledCorrectly({
      page,
      productName: editProductData.name,
      productValues: editProductData,
    });
  }
});
test('Delete product in quotation', async ({ page }) => {
  if (createQuotationData?.lineGroupItems?.[0]?.products?.[0]) {
    await navigateToQuotationEdit({
      page,
      quotationId,
      opportunityId,
      newQuotationName,
    });

    await deleteLineItemGroup({ page, itemName: editProductData.name });

    const productNameWithoutSpace = removeSpaceFromString(editProductData.name);
    const groupName = removeSpaceFromString(tenantGroupIdMap[0]);

    // Checking the product is deleted successfully
    await expect(
      page.getByTestId(`${groupName}-${productNameWithoutSpace}`)
    ).not.toBeVisible();

    const quotationSaveBtn = await page.getByTestId(
      `${proposalTestIds.editQuotationBtn}-save-btn`
    );
    await expect(quotationSaveBtn).toBeVisible();
    await quotationSaveBtn.click();

    await expect(async () => {
      await page
        .getByTestId(opportunityTestIds.addQuotationButton)
        .waitFor({ state: 'attached' });
    }).toPass();

    await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesDetails);

    // Opening the quotation again to check the product is deleted successfully after deleting product from the quotation

    await navigateToQuotationEdit({
      page,
      quotationId,
      opportunityId,
      newQuotationName,
    });

    // Checking the product is deleted successfully after saving the quotation
    await expect(
      page.getByTestId(`${groupName}-${productNameWithoutSpace}`)
    ).not.toBeVisible();

    // Close edit quotation

    const quotationCancelBtn = await page.getByTestId(
      `${proposalTestIds.editQuotationBtn}-cancel-btn`
    );
    await expect(quotationCancelBtn).toBeVisible();
    await quotationCancelBtn.click();

    await page
      .getByTestId(opportunityTestIds.addQuotationButton)
      .waitFor({ state: 'attached' });
  }
});

test('Delete quotation', async ({ page }) => {
  await deleteQuotation({ page, quotationName: newQuotationName });
  const quotation = await page.getByTestId(newQuotationName);
  await quotation.waitFor({ state: 'detached' });

  await expect(quotation).not.toBeVisible();
});
