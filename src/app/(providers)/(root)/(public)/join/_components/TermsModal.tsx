import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from '@nextui-org/react';

export default function TermsModal() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <div className="mb-[20px]">
      <Button onPress={onOpen} className="bg-[#0051FF] text-white float-right">
        What Surv 약관 보기
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl" scrollBehavior="inside">
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                What Surv 이용 약관, 개인정보처리방침, 제 3 자 정보 제공 동의
              </ModalHeader>
              <ModalBody>
                <p className="text-2xl font-bold">[ 이용약관 ]</p>

                <p className="font-bold">제 1 조 (서비스 소개)</p>
                <p>
                  WhatSurv은 사용자들에게 사용자의 니즈를 더 쉽고 빠르게 파악하고 싶은 IT 업계 종사자를 위한 서베이를
                  제공합니다.
                </p>
                <p>본 약관은 WhatSurv의 서비스 이용과 관련된 조건 및 규칙을 설명합니다.</p>

                <p className="font-bold">제 2 조 (사용자 의무)</p>
                <p>
                  사용자는 WhatSurv의 서비스를 법적, 윤리적으로 적절하게 이용해야 합니다. 불법적이거나 부적절한 행위는
                  금지됩니다.
                </p>

                <p className="font-bold">제 3 조 (서비스 변경 및 중단)</p>
                <p>
                  본 사이트는 서비스의 내용을 언제든지 변경하거나 중단할 수 있는 권리를 보유합니다. 이러한 변경은
                  사용자에게 별도로 통지하지 않을 수 있습니다.
                </p>

                <p className="font-bold">제 4 조 (책임의 한계)</p>
                <p>본 사이트는 서비스 이용 중 발생하는 직접적 또는 간접적 손해에 대해 책임을 지지 않습니다.</p>

                <p className="font-bold">제 5 조 (계정 보안)</p>
                <p>
                  사용자는 자신의 계정 정보를 안전하게 관리할 책임이 있습니다. 비밀번호 유출이나 계정 접근에 대한 책임은
                  사용자에게 있습니다.
                </p>

                <p className="font-bold">제 6 조 (이용 제한)</p>
                <p>본 사이트는 사용자가 본 약관을 위반하는 경우, 서비스 이용을 제한하거나 계정을 정지할 수 있습니다.</p>
                <hr />
                <p className="text-2xl font-bold">[ 개인정보처리방침 ]</p>

                <p className="font-bold">1. 개인정보 수집 및 이용</p>
                <p>① 본 사이트는 서비스 제공을 위해 필요한 최소한의 개인정보를 수집합니다.</p>
                <p>② 사용자 관리와 설문 조사, 서비스 개선 등에 사용됩니다.</p>

                <p className="font-bold">2. 개인정보 보호</p>
                <p>수집된 개인정보는 엄격히 보호되며, 무단으로 제 3 자에게 공개되지 않습니다.</p>

                <p className="font-bold">3. 사용자 권리</p>
                <p>사용자는 언제든지 자신의 개인정보에 대한 접근, 정정, 삭제를 요청할 수 있습니다.</p>

                <p className="font-bold">4. 개인정보의 공유 및 전달</p>
                <p>
                  사용자의 개인정보는 법적 요구사항에 따라 또는 사용자의 명시적 동의가 있을 경우에만 제 3 자에게 공유될
                  수 있습니다.
                </p>
                <hr />
                <p className="text-2xl font-bold"> [제 3자 정보 제공 동의]</p>

                <p className="font-bold">1. 제 3 자 정보 제공 동의</p>
                <p>
                  ① 본 사이트는 사용자의 개인정보를 설문조사를 수행하는 제 3 자(설문조사를 작성하는 주체)와 공유할 수
                  있습니다.
                </p>
                <p>② 이러한 정보 공유는 사용자의 명시적인 동의를 기반으로 이루어집니다.</p>

                <p className="font-bold">2. 정보 공유 목적</p>
                <p>
                  제공되는 개인정보는 설문조사의 목적으로만 사용됩니다. 제 3 자는 이 정보를 본 사이트의 명시된 목적
                  외에는 사용할 수 없습니다.
                </p>

                <p className="font-bold">3. 제 3 자의 정보 보호 책임</p>
                <p>
                  제 3 자(설문조사를 작성하는 주체)는 사용자의 개인정보를 안전하게 보호할 책임이 있으며, 해당 정보의
                  무단 사용, 공개, 또는 변조를 금지합니다.
                </p>

                <p className="font-bold">4. 사용자 권리</p>
                <p>
                  사용자는 언제든지 제 3 자(설문조사를 작성하는 주체)에게 정보 공유에 대한 동의를 철회할 수 있으며, 이
                  경우 관련 개인정보는 더 이상 제 3 자와 공유되지 않습니다.
                </p>

                <p>이 약관들은 2024년 1월 1일부터 적용됩니다.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
