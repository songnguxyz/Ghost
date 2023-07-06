import ButtonGroup from '../ButtonGroup';
import DesktopChromeHeader from '../chrome/DesktopChromeHeader';
import Heading from '../Heading';
import MobileChrome from '../chrome/MobileChrome';
import Modal, {ModalSize} from './Modal';
import NiceModal, {useModal} from '@ebay/nice-modal-react';
import React, {useEffect, useState} from 'react';
import Select, {SelectOption} from '../form/Select';
import TabView, {Tab} from '../TabView';
import useGlobalDirtyState from '../../../hooks/useGlobalDirtyState';
import {ButtonProps} from '../Button';
import {confirmIfDirty} from '../../../utils/modals';

export interface PreviewModalProps {
    testId?: string;
    title?: string;
    size?: ModalSize;
    sidebar?: boolean | React.ReactNode;
    preview?: React.ReactNode;
    dirty?: boolean
    cancelLabel?: string;
    okLabel?: string;
    okColor?: string;
    buttonsDisabled?: boolean
    previewToolbar?: boolean;
    leftToolbar?: boolean;
    rightToolbar?: boolean;
    deviceSelector?: boolean;
    previewToolbarURLs?: SelectOption[];
    selectedURL?: string;
    previewToolbarTabs?: Tab[];
    defaultTab?: string;
    sidebarButtons?: React.ReactNode;
    sidebarHeader?: React.ReactNode;
    sidebarPadding?: boolean;
    sidebarContentClasses?: string;

    onCancel?: () => void;
    onOk?: () => void;
    afterClose?: () => void;
    onSelectURL?: (url: string) => void;
    onSelectDesktopView?: () => void;
    onSelectMobileView?: () => void;
}

export const PreviewModalContent: React.FC<PreviewModalProps> = ({
    testId,
    title,
    size = 'full',
    sidebar = '',
    preview,
    dirty = false,
    cancelLabel = 'Cancel',
    okLabel = 'OK',
    okColor = 'black',
    previewToolbar = true,
    leftToolbar = true,
    rightToolbar = true,
    deviceSelector = true,
    previewToolbarURLs,
    selectedURL,
    previewToolbarTabs,
    buttonsDisabled,
    sidebarButtons,
    sidebarHeader,
    sidebarPadding = true,
    sidebarContentClasses,

    onCancel,
    onOk,
    afterClose,
    onSelectURL,
    onSelectDesktopView,
    onSelectMobileView
}) => {
    const modal = useModal();
    const {setGlobalDirtyState} = useGlobalDirtyState();

    useEffect(() => {
        setGlobalDirtyState(dirty);
    }, [dirty, setGlobalDirtyState]);

    const [view, setView] = useState('desktop');

    if (view === 'mobile' && deviceSelector) {
        preview = (
            <MobileChrome data-testid="preview-mobile">
                {preview}
            </MobileChrome>
        );
    }

    if (previewToolbar) {
        let toolbarLeft = (<></>);
        if (previewToolbarURLs) {
            toolbarLeft = (
                <Select options={previewToolbarURLs!} selectedOption={selectedURL} onSelect={onSelectURL!} />
            );
        } else if (previewToolbarTabs) {
            toolbarLeft = <TabView
                border={false}
                selectedTab={selectedURL}
                tabs={previewToolbarTabs}
                width='wide'
                onTabChange={onSelectURL!}
            />;
        }

        const unSelectedIconColorClass = 'text-grey-500';
        const toolbarRight = deviceSelector && (
            <ButtonGroup
                buttons={[
                    {
                        icon: 'laptop',
                        label: 'Desktop',
                        hideLabel: true,
                        link: true,
                        size: 'sm',
                        iconColorClass: (view === 'desktop' ? 'text-black' : unSelectedIconColorClass),
                        onClick: onSelectDesktopView || (() => {
                            setView('desktop');
                        })
                    },
                    {
                        icon: 'mobile',
                        label: 'Mobile',
                        hideLabel: true,
                        link: true,
                        size: 'sm',
                        iconColorClass: (view === 'mobile' ? 'text-black' : unSelectedIconColorClass),
                        onClick: onSelectMobileView || (() => {
                            setView('mobile');
                        })
                    }
                ]}
            />
        );

        preview = (
            <>
                <DesktopChromeHeader
                    data-testid="design-toolbar"
                    size='lg'
                    toolbarCenter={<></>}
                    toolbarLeft={leftToolbar && toolbarLeft}
                    toolbarRight={rightToolbar && toolbarRight}
                />
                <div className='flex h-full grow items-center justify-center bg-grey-50 text-sm text-grey-400'>
                    {preview}
                </div>
            </>
        );
    }

    let buttons: ButtonProps[] = [];

    if (!sidebarButtons) {
        buttons.push({
            key: 'cancel-modal',
            label: cancelLabel,
            onClick: (onCancel ? onCancel : () => {
                confirmIfDirty(dirty, () => {
                    modal.remove();
                    afterClose?.();
                });
            }),
            disabled: buttonsDisabled
        });

        buttons.push({
            key: 'ok-modal',
            label: okLabel,
            color: okColor,
            className: 'min-w-[80px]',
            onClick: onOk,
            disabled: buttonsDisabled
        });
    }

    return (
        <Modal
            afterClose={afterClose}
            footer={false}
            noPadding={true}
            size={size}
            testId={testId}
            title=''
        >
            <div className='flex h-full grow'>
                <div className='flex grow flex-col'>
                    {preview}
                </div>
                {sidebar &&
                    <div className='relative flex h-full basis-[400px] flex-col border-l border-grey-100'>
                        {sidebarHeader ? sidebarHeader : (
                            <div className='flex max-h-[74px] items-start justify-between gap-3 px-7 py-5'>
                                <Heading className='mt-1' level={4}>{title}</Heading>
                                {sidebarButtons ? sidebarButtons : <ButtonGroup buttons={buttons} /> }
                            </div>
                        )}
                        <div className={`${!sidebarHeader ? 'absolute inset-x-0 bottom-0 top-[74px] grow' : ''} ${sidebarPadding && 'p-7 pt-0'} flex flex-col justify-between overflow-y-auto ${sidebarContentClasses}`}>
                            {sidebar}
                        </div>
                    </div>
                }
            </div>
        </Modal>
    );
};

export default NiceModal.create(PreviewModalContent);
