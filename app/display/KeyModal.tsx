import { Box, Button, Modal, Title } from "@mantine/core";
import QRCode from "qrcode";
import { FC, useEffect, useState } from "react";

interface KeyModalProps {
  voteKey: string;
  opened: boolean;
  onClose: () => void;
}

const KeyModal: FC<KeyModalProps> = ({ voteKey, onClose, opened }) => {
  const [urlObject, setUrlObject] = useState<string | null>(null);

  useEffect(() => {
    if (!voteKey) return;
    const generateCode = async () => {
      const url = await QRCode.toDataURL(
        window.location.origin + "?key=" + voteKey,
        {
          width: 1200,
          margin: 0,
        }
      );

      setUrlObject(url);
    };

    generateCode();
  }, [voteKey]);

  return (
    <Modal
      size="xl"
      opened={opened}
      onClose={() => onClose()}
      title="Hlasovací klíč"
    >
      {urlObject && (
        <Box
          p={32}
          sx={{
            backgroundColor: "white",
            width: "fit-content",
            borderRadius: 8,
            maxWidth: "30rem",
            margin: "0 auto",
          }}
        >
          <img
            src={urlObject}
            alt="QR Code"
            style={{
              objectFit: "contain",
              width: "100%",
            }}
          />
        </Box>
      )}

      <Title
        ta="center"
        sx={{
          fontSize: 80,
          letterSpacing: 24,
        }}
      >
        {voteKey}
      </Title>

      <Button
        color="#5c0087"
        mt={16}
        onClick={() => {
          onClose();
        }}
        fullWidth
      >
        Zavřít
      </Button>
    </Modal>
  );
};

export default KeyModal;
