"""empty message

Revision ID: 9bd24cf89dcf
Revises: bab54860ef85
Create Date: 2023-10-15 11:40:00.066488

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9bd24cf89dcf'
down_revision = 'bab54860ef85'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('test')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('test', sa.VARCHAR(), autoincrement=False, nullable=True))

    # ### end Alembic commands ###