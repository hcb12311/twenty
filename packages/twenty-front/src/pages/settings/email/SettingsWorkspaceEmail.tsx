import { useLazyQuery } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';

import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsDiscoveryHeroCard } from '@/settings/components/SettingsDiscoveryHeroCard';
import { SettingsOptionCardContentButton } from '@/settings/components/SettingsOptions/SettingsOptionCardContentButton';
import { GET_UNSUBSCRIBE_PAGE_PREVIEW_URL } from '@/settings/unsubscribe-topics/graphql/queries/getUnsubscribePagePreviewUrl';
import { SettingsWorkspaceEmailGroupSection } from '@/settings/workspace/components/SettingsWorkspaceEmailGroupSection';
import { SettingsPageLayout } from '@/settings/components/layout/SettingsPageLayout';
import { TabList } from '@/ui/layout/tab-list/components/TabList';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { FeatureFlagKey, SettingsPath } from 'twenty-shared/types';
import { getSettingsPath, isDefined } from 'twenty-shared/utils';
import {
  IconArrowUpRight,
  IconBrandWhatsapp,
  IconMail,
  IconPhone,
} from 'twenty-ui/icon';
import { IconButton } from 'twenty-ui/input';
import { Card } from 'twenty-ui/surfaces';
import { H2Title } from 'twenty-ui/typography';
import { Section } from 'twenty-ui/layout';
import coverDark from '~/pages/settings/email/assets/cover-dark.png';
import coverLight from '~/pages/settings/email/assets/cover-light.png';

const COMMUNICATIONS_TABS_INSTANCE_ID = 'settings-communications-tabs';

const StyledUnsubscribePageCard = styled(Card)`
  cursor: pointer;
`;

export const SettingsWorkspaceEmail = () => {
  const { t } = useLingui();

  const isEmailGroupFeatureEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_EMAIL_GROUP_ENABLED,
  );

  const [getPreviewUrl] = useLazyQuery<{
    unsubscribePagePreviewUrl: string;
  }>(GET_UNSUBSCRIBE_PAGE_PREVIEW_URL);

  // Open the tab synchronously on click (so it isn't popup-blocked), then point
  // it at the freshly minted preview URL once the query resolves.
  const handleSeeUnsubscribePage = () => {
    const previewWindow = window.open('', '_blank');

    void getPreviewUrl()
      .then(({ data }) => {
        const url = data?.unsubscribePagePreviewUrl;

        if (isDefined(previewWindow) && isDefined(url)) {
          previewWindow.location.href = url;
        } else {
          previewWindow?.close();
        }
      })
      .catch(() => previewWindow?.close());
  };

  if (!isEmailGroupFeatureEnabled) {
    return null;
  }

  return (
    <SettingsPageLayout
      title={t`Communications`}
      links={[
        {
          children: t`Workspace`,
          href: getSettingsPath(SettingsPath.General),
        },
        { children: t`Communications` },
      ]}
    >
      <SettingsPageContainer>
        <TabList
          componentInstanceId={COMMUNICATIONS_TABS_INSTANCE_ID}
          tabs={[
            { id: 'emails', title: t`Emails`, Icon: IconMail },
            {
              id: 'whatsapp',
              title: t`Whatsapp`,
              Icon: IconBrandWhatsapp,
              disabled: true,
              pill: t`Soon`,
            },
            {
              id: 'calls',
              title: t`Calls`,
              Icon: IconPhone,
              disabled: true,
              pill: t`Soon`,
            },
          ]}
        />
        <Section>
          <SettingsDiscoveryHeroCard
            lightSrc={coverLight}
            darkSrc={coverDark}
            instanceIdPrefix="settings-communications-hero"
            tabs={[]}
          />
        </Section>
        <SettingsWorkspaceEmailGroupSection />
        <Section>
          <H2Title
            title={t`Unsubscribe`}
            description={t`The page your users will get redirected to to unsubscribe from your emails`}
          />
          <StyledUnsubscribePageCard rounded onClick={handleSeeUnsubscribePage}>
            <SettingsOptionCardContentButton
              Icon={IconMail}
              title={t`See unsubscribe page`}
              Button={
                <IconButton
                  Icon={IconArrowUpRight}
                  variant="tertiary"
                  size="small"
                  ariaLabel={t`See unsubscribe page`}
                />
              }
            />
          </StyledUnsubscribePageCard>
        </Section>
      </SettingsPageContainer>
    </SettingsPageLayout>
  );
};
