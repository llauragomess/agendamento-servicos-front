import { useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ProfessionalDTO } from '../dtos/ProfessionalDTO';
import {
    createProfessional, deleteProfessional, getProfessionalById,
    updateProfessional
} from '../services/ProfessionalService';
import { ContentBox } from '../styles/section';

export default function ProfessionalPage() {
    const [Profissionals, setProfissionals] = useState<ProfessionalDTO[]>([]);
    const [formVisible, setFormVisible] = useState(false);
    const [buscaId, setBuscaId] = useState('');
    const [formData, setFormData] = useState<ProfessionalDTO>({
        name: '',
        specialty: '',
        cellphone: '',
        email: '',
    });

    const toast = useRef<Toast>(null);

    const buscarProfissional = async () => {
        try {
            const result = await getProfessionalById(Number(buscaId));
            setProfissionals([result]);
            toast.current?.show({
                severity: 'info',
                summary: 'Sucesso',
                detail: `ID Profissional: ${result.id} `,
                life: 3000
            });
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Profissional não encontrado',
                life: 3000
            });
        }
    };

    const salvarProfissional = async () => {
        try {
            if (formData.id) {
                const atualizado = await updateProfessional(formData.id, formData);
                setProfissionals((prev) =>
                    prev.map((c) => (c.id === atualizado.id ? atualizado : c))
                );
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Profissional atualizado com sucesso',
                    life: 3000
                });
            } else {
                const criado = await createProfessional(formData);
                setProfissionals((prev) => [...prev, criado]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Profissional adicionado',
                    life: 3000
                });
            }
            setFormVisible(false);
            setFormData({ name: '', cellphone: '', email: '', specialty: '' });
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao salvar Profissional',
                life: 3000
            });
        }
    };

    const excluirProfissional = async (id: number) => {
        try {
            await deleteProfessional(id);
            setProfissionals((prev) => prev.filter((c) => c.id !== id));
            toast.current?.show({
                severity: 'warn',
                summary: 'Removido',
                detail: `Profissional ID ${id} foi removido`,
                life: 3000
            });
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao deletar Profissional',
                life: 3000
            });
        }
    };

    const abrirEditor = (Profissional?: ProfessionalDTO) => {
        setFormData(Profissional ?? { name: '', email: '', cellphone: '', specialty: '' });
        setFormVisible(true);
    };

    return (
        <ContentBox>

            <Toast ref={toast} />

            <div style={{ padding: '1.5rem' }}>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '1rem'
                    }}
                >
                    <InputText
                        value={buscaId}
                        placeholder="Identificador"
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem', minWidth: '200px' }}
                        onChange={(e) => setBuscaId(e.target.value)}
                    />
                    <Button
                        label="Buscar Profissional pelo ID"
                        icon="pi pi-search"
                        onClick={buscarProfissional}
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem' }}
                    />
                    <Button
                        label="Novo Profissional"
                        icon="pi pi-plus"
                        severity="success"
                        onClick={() => abrirEditor()}
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem' }}
                    />
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <DataTable
                        value={Profissionals}
                        emptyMessage="Nenhum profissional encontrado"
                        scrollable
                        responsiveLayout="scroll"
                        scrollHeight="flex"
                        tableStyle={{ minWidth: '60rem', borderRadius: '4px', marginTop: '5rem' }}
                    >
                        <Column field="name" header="Nome" />
                        <Column field="cellphone" header="Celular" />
                        <Column field="specialty" header="Especialidade" />
                        <Column field="email" header="E-mail" />
                        <Column
                            header="Ações"
                            style={{ textAlign: 'center' }}
                            body={(rowData) => (
                                <div className="flex gap-2">
                                    <Button
                                        icon="pi pi-pencil"
                                        text
                                        rounded
                                        severity="info"
                                        onClick={() => abrirEditor(rowData)}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        text
                                        rounded
                                        severity="danger"
                                        onClick={() => excluirProfissional(rowData.id!)}
                                    />
                                </div>
                            )}
                        />
                    </DataTable>
                </div>
            </div>

            <Dialog
                header={formData.id ? 'Editar Profissional' : 'Novo Profissional'}
                headerStyle={{ padding: '1rem' }}
                visible={formVisible}
                onHide={() => setFormVisible(false)}
                style={{ width: '50%' }}
                footer={
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'flex-end',
                        alignItems: 'flex-end',
                        gap: '0.75rem',
                        margin: '1.5rem',
                    }}>
                        <Button
                            label="Salvar"
                            icon="pi pi-check"
                            severity="success"
                            style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem' }}
                            onClick={salvarProfissional}
                        />

                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem' }}
                            onClick={() => setFormVisible(false)}
                            severity="danger"
                        />
                    </div>
                }
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    margin: '1rem'
                }}>
                    <InputText
                        id="name"
                        value={formData.name}
                        placeholder='Nome'
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem', width: '100%' }}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <InputText
                        id="cellphone"
                        value={formData.cellphone}
                        placeholder='Celular'
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem', width: '100%' }}
                        onChange={(e) => setFormData({ ...formData, cellphone: e.target.value })}
                    />

                    <InputText
                        id="specialty"
                        value={formData.specialty}
                        placeholder='Especialidade'
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem', width: '100%' }}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    />

                    <InputText
                        id="email"
                        value={formData.email}
                        placeholder='Email'
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem', width: '100%' }}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
            </Dialog>

        </ContentBox>


    );
}