"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Icon,
  Input,
  Modal,
  Reveal,
  Section,
  Select,
  Sheet,
  Textarea,
} from "@/components/ui";

export default function UiDevPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <main className="pb-24">
      <Section
        id="botones"
        title="UI base"
        eyebrow="Sistema"
        intro="Muestra de componentes. Botones con foco visible y motion que respeta prefers-reduced-motion."
      >
        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle>Botones</CardTitle>
              <CardDescription>sólido / borde / ghost / icono</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button>Botón primary</Button>
              <Button variant="outline">Botón borde</Button>
              <Button variant="ghost">Botón ghost</Button>
              <div className="flex gap-3">
                <Button size="icon" aria-label="Compartir">
                  <Icon name="share" />
                </Button>
                <Button size="icon" variant="outline" aria-label="Descargar">
                  <Icon name="download" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Menú">
                  <Icon name="menu" />
                </Button>
              </div>
              <Button disabled>Deshabilitado</Button>
            </CardContent>
          </Card>
        </Reveal>
      </Section>

      <Section id="form" title="Formularios">
        <Reveal delay={0.05}>
          <Card>
            <CardContent className="flex flex-col gap-4 pt-5">
              <Input placeholder="Título del proyecto" />
              <Textarea placeholder="Descripción (máx. 280 caracteres)" />
              <Select defaultValue="conduccion">
                <option value="conduccion">Conducción</option>
                <option value="locucion">Locución</option>
                <option value="entrevistas">Entrevistas</option>
              </Select>
            </CardContent>
          </Card>
        </Reveal>
      </Section>

      <Section id="overlays" title="Overlays">
        <Reveal delay={0.05}>
          <Card>
            <CardHeader>
              <CardTitle>Modal, Sheet y Toast</CardTitle>
              <CardDescription>
                Modal con Radix Dialog, Sheet con Vaul, toasts con Sonner.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button onClick={() => setModalOpen(true)}>Abrir modal</Button>
              <Button variant="outline" onClick={() => setSheetOpen(true)}>
                Abrir sheet
              </Button>
              <Button
                variant="ghost"
                onClick={() => toast.success("Proyecto guardado correctamente")}
              >
                Mostrar toast
              </Button>
            </CardContent>
          </Card>
        </Reveal>
      </Section>

      <Section id="tarjeta" title="Card">
        <Reveal delay={0.05}>
          <Card>
            <CardHeader>
              <CardTitle>Ejemplo de tarjeta</CardTitle>
              <CardDescription>
                Superficie de papel, borde fino y sin sombra.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-subtle">
                Las tarjetas se usan para proyectos, formularios del admin y
                contenedores de contenido.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Acción</Button>
              <Button size="sm" variant="ghost">
                Secundaria
              </Button>
            </CardFooter>
          </Card>
        </Reveal>
      </Section>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Modal de ejemplo"
        description="Diálogo accesible con Radix: foco atrapado, Escape cierra."
      >
        <p className="text-sm text-subtle">
          Contenido del modal. Se usa para compartir, confirmaciones y previews.
        </p>
        <Button className="mt-6 w-full" onClick={() => setModalOpen(false)}>
          Entendido
        </Button>
      </Modal>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title="Menú">
        <nav className="flex flex-col gap-1">
          {["Inicio", "Conducción", "Locución", "Entrevistas", "Contacto"].map(
            (item) => (
              <a
                key={item}
                href="#overlays"
                onClick={() => setSheetOpen(false)}
                className="flex min-h-12 items-center rounded-xl px-4 font-display text-xl text-foreground transition-colors hover:bg-muted"
              >
                {item}
              </a>
            ),
          )}
        </nav>
      </Sheet>
    </main>
  );
}
